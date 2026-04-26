import { OpenAI } from 'RemoteServiceGateway.lspkg/HostedExternal/OpenAI';
import { VideoController } from "RemoteServiceGateway.lspkg/Helpers/VideoController";

@component
export class AiScanLogic extends BaseScriptComponent {
    private cameraModule: CameraModule = require("LensStudio:CameraModule");
    private videoController = new VideoController(1500, CompressionQuality.HighQuality, EncodingType.Jpg);

    @input
    @hint("Where AI answers are sent. Assign ShowFeedback script component.")
    feedbackController!: any;

    @input
    @hint("Seconds between scans.")
    scanInterval: number = 15.0;

    @input
    @hint("Delay before first scan starts (seconds).")
    initialScanDelay: number = 12.0;

    @input
    @hint("Capture size for the smaller axis (e.g. 512).")
    imageSmallerDimension: number = 512;

    @input
    @hint("Camera to use for still capture.")
    @widget(new ComboBoxWidget()
        .addItem("Default Color", 0)
        .addItem("Left Color", 1)
        .addItem("Right Color", 2))
    cameraId: number = 0;

    @input
    @hint("Mode: Tutoring, Checking, or Answer Key.")
    mode: string = "Tutoring";

    @input
    @hint("Optional TrackState script (uses getMode() each scan if assigned).")
    @allowUndefined
    modeStateController?: any;

    @input
    @hint("Debug stage: 0=timer only, 1=capture only, 2=capture+encode only, 3=full pipeline")
    debugStage: number = 3;

    private isChecking: boolean = false;
    private consecutiveFailures: number = 0;
    private scanDisabled: boolean = false;

    onAwake() {
        this.createEvent("OnStartEvent").bind(() => {
            this.startScanLoop();
        });

        // Keep parity with template setup so this can be extended to streaming later.
        this.videoController.onEncodedFrame.add((_encodedFrame: string) => {
            // no-op in still-image mode
        });
    }

    private startScanLoop() {
        const scanTimer = this.createEvent("DelayedCallbackEvent");
        scanTimer.bind(() => {
            this.performScanTick();
            scanTimer.reset(this.scanInterval);
        });
        scanTimer.reset(Math.max(0.1, this.initialScanDelay));
    }

    private async performScanTick() {
        if (this.isChecking || this.scanDisabled) return;
        this.isChecking = true;
        print("[AI Scan] Tick. stage=" + this.debugStage);

        try {
            if (this.debugStage <= 0) {
                return;
            }

            const texture = await this.captureStillImage();
            if (!texture) {
                this.registerFailure("capture returned null");
                return;
            }

            if (this.debugStage === 1) {
                print("[AI Scan] Stage 1 OK: still image captured.");
                this.consecutiveFailures = 0;
                return;
            }

            const base64Image = await this.encodeTexture(texture);
            if (!base64Image || base64Image.length < 16) {
                this.registerFailure("encoded image empty");
                return;
            }

            if (this.debugStage === 2) {
                print("[AI Scan] Stage 2 OK: capture+encode success, len=" + base64Image.length);
                this.consecutiveFailures = 0;
                return;
            }

            const dataUri = `data:image/jpeg;base64,${base64Image}`;
            const effectiveMode = this.resolveMode();
            print("[AI Scan] Using mode: " + effectiveMode);
            print("[AI Scan] Sending request to OpenAI...");
            const answer = await this.requestAiFeedback(dataUri, effectiveMode);
            this.deliverAnswer(answer);
            this.consecutiveFailures = 0;
        } catch (error) {
            this.registerFailure(this.describeError(error));
        } finally {
            this.isChecking = false;
        }
    }

    private async captureStillImage(): Promise<Texture | null> {
        try {
            const imageRequest = CameraModule.createImageRequest();
            (imageRequest as any).imageSmallerDimension = Math.max(128, Math.floor(this.imageSmallerDimension));
            (imageRequest as any).cameraId = this.getCameraIdEnum();
            const imageFrame = await this.cameraModule.requestImage(imageRequest);
            return imageFrame?.texture ?? null;
        } catch (error) {
            print("[AI Scan] captureStillImage failed: " + String(error ?? ""));
            return null;
        }
    }

    private encodeTexture(texture: Texture): Promise<string> {
        return new Promise<string>((resolve, reject) => {
            try {
                Base64.encodeTextureAsync(
                    texture,
                    (encodedString: string) => resolve(encodedString),
                    () => reject("encodeTextureAsync failed"),
                    CompressionQuality.HighQuality,
                    EncodingType.Jpg
                );
            } catch (error) {
                reject(error);
            }
        });
    }

    private async requestAiFeedback(dataUri: string, mode: string): Promise<string> {
        const internet = this.getInternetStatusLabel();
        if (internet !== "online") {
            throw "openai preflight failed: internet=" + internet;
        }

        try {
            const response = await OpenAI.chatCompletions({
                model: 'gpt-4o',
                messages: [
                    {
                        role: 'system',
                        content: this.buildSystemPrompt(mode),
                    },
                    {
                        role: 'user',
                        content: [
                            { type: "text", text: "Check this math." },
                            {
                                type: "image_url",
                                image_url: { url: dataUri },
                            },
                        ],
                    },
                ],
                temperature: 0.2,
            });

            const answer = response?.choices?.[0]?.message?.content?.trim() ?? "CORRECT";
            print("[AI Scan] AI response: " + answer);
            return answer;
        } catch (error) {
            const described = this.describeError(error);
            throw "openai request failed | " + described + " | imageChars=" + dataUri.length;
        }
    }

    private buildSystemPrompt(mode: string): string {
        print(mode);
        if (mode === "Tutoring") {
            return "You are a math tutor. Review the math in the provided image. If there is a mistake, point to what is wrong and explain WHY it's wrong to help guide the student. Do NOT provide an answer to the math problem. Only point to where the user went wrong. If the math is correct, reply with \"CORRECT\" only.";
        }
        if (mode === "Checking") {
            return "You are a phd level math professor. Review the math in th provided image. If there is a mistake or you do not see any math, repy with \"WRONG\", otherwise reply with \"CORRECT\"";
        }
        if (mode === "Answer Key") {
            return "You are a math tutor in Answer Key mode. Review the math in the provided image. If there is a mistake, give the FULL correct answer showing all steps. If the math is correct, reply with \"CORRECT\" only.";
        }
        return "You are a math tutor. Review the math in the provided image. If the math is correct, or if there is no math visible, reply with the exact word: CORRECT.";
    }

    private deliverAnswer(answer: string): void {
        if (this.feedbackController && typeof this.feedbackController.handleAiAnswer === "function") {
            this.feedbackController.handleAiAnswer(answer);
        } else {
            print("[AI Scan] feedbackController missing handleAiAnswer(answer).");
        }
    }

    private registerFailure(reason: string): void {
        this.consecutiveFailures += 1;
        print("[AI Scan] Failure: " + reason);
        if (this.consecutiveFailures >= 3) {
            print("[AI Scan] Cooling down after repeated failures.");
        }
        if (this.consecutiveFailures >= 5) {
            this.scanDisabled = true;
            print("[AI Scan] Disabled after 5 consecutive failures.");
        }
    }

    private getCameraIdEnum(): CameraModule.CameraId {
        if (this.cameraId === 1) return CameraModule.CameraId.Left_Color;
        if (this.cameraId === 2) return CameraModule.CameraId.Right_Color;
        return CameraModule.CameraId.Default_Color;
    }

    private resolveMode(): string {
        try {
            const controller = this.modeStateController as any;
            if (controller && typeof controller.getMode === "function") {
                const stateMode = String(controller.getMode() ?? "").trim();
                if (stateMode.length > 0) {
                    return stateMode;
                }
            }
        } catch (error) {
            print("[AI Scan] modeStateController.getMode failed: " + String(error ?? ""));
        }
        return String(this.mode ?? "Tutoring").trim() || "Tutoring";
    }

    private getInternetStatusLabel(): string {
        try {
            const dis = (globalThis as any).deviceInfoSystem;
            if (dis && typeof dis.isInternetAvailable === "function") {
                return dis.isInternetAvailable() ? "online" : "offline";
            }
            return "unknown";
        } catch (_) {
            return "unknown";
        }
    }

    private describeError(error: any): string {
        if (error === null) return "null";
        if (error === undefined) return "undefined";

        try {
            const asAny = error as any;
            const parts: string[] = [];
            parts.push("type=" + typeof error);

            if (asAny.name) parts.push("name=" + String(asAny.name));
            if (asAny.message) parts.push("message=" + String(asAny.message));
            if (asAny.status !== undefined) parts.push("status=" + String(asAny.status));
            if (asAny.code !== undefined) parts.push("code=" + String(asAny.code));

            const base = String(error);
            if (base && base !== "[object Object]") parts.push("value=" + base);

            const json = JSON.stringify(error);
            if (json && json !== "{}") parts.push("json=" + json);

            return parts.join(" | ");
        } catch (_) {
            return "unserializable error";
        }
    }
}
