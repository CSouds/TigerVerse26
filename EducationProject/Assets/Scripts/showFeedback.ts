import { OpenAI } from 'RemoteServiceGateway.lspkg/HostedExternal/OpenAI';

@component
export class ShowFeedback extends BaseScriptComponent {

    @input
    iIcon!: SceneObject;

    @input
    interactable!: any;

    @input
    textComponent!: Text;

    @input
    textBubbleContainer!: SceneObject;

    @input
    cameraFeed!: Texture;

    @input
    @hint("Seconds between scans.")
    scanInterval: number = 5.0;

    private isChecking: boolean = false;
    private latestFeedback: string = "";
    private consecutiveFailures: number = 0;
    private scanDisabled: boolean = false;

    onAwake() {
        if (this.iIcon) {
            this.iIcon.enabled = false;
        }
        if (this.textBubbleContainer) {
            this.textBubbleContainer.enabled = false;
        }

        this.createEvent("OnStartEvent").bind(() => {
            this.bindPinch();
            this.startScanLoop();
        });
    }

    private bindPinch() {
        if (!this.interactable) {
            print("ShowFeedback: Interactable not linked.");
            return;
        }
        this.interactable.onTriggerStart.add(() => {
            this.revealBubble();
        });
    }

    private startScanLoop() {
        const scanTimer = this.createEvent("DelayedCallbackEvent");
        scanTimer.bind(() => {
            this.performContinuousScan();
            scanTimer.reset(this.scanInterval);
        });
        scanTimer.reset(this.scanInterval);
    }

    private revealBubble() {
        if (!this.iIcon || !this.iIcon.enabled) return;
        if (this.textComponent) {
            this.textComponent.text = this.latestFeedback;
        }
        if (this.textBubbleContainer) {
            this.textBubbleContainer.enabled = true;
        }
    }

    private showMistake(feedback: string) {
        this.latestFeedback = feedback;
        if (this.iIcon) {
            this.iIcon.enabled = true;
        }
    }

    private clearMistake() {
        this.latestFeedback = "";
        if (this.iIcon) {
            this.iIcon.enabled = false;
        }
        if (this.textBubbleContainer) {
            this.textBubbleContainer.enabled = false;
        }
    }

    performContinuousScan() {
        if (this.isChecking || this.scanDisabled) return;
        this.isChecking = true;
        print("[Scan] Capturing frame and sending to AI...");

        if (!this.cameraFeed) {
            print("[Scan] Aborted: cameraFeed is not assigned.");
            this.isChecking = false;
            return;
        }

        const tex = this.cameraFeed as any;
        const w = typeof tex.getWidth === "function" ? tex.getWidth() : 0;
        const h = typeof tex.getHeight === "function" ? tex.getHeight() : 0;
        print("[Scan] cameraFeed size: " + w + "x" + h);
        if (!w || !h) {
            print("[Scan] Aborted: cameraFeed has zero size (not ready yet).");
            this.isChecking = false;
            return;
        }

        print("[Scan] Encoding frame to JPG base64...");
        Base64.encodeTextureAsync(
            this.cameraFeed,
            (base64Image: string) => {
                print("[Scan] Encoded " + base64Image.length + " chars.");
                const dataUri = `data:image/jpeg;base64,${base64Image}`;
                this.sendToChatGPT(dataUri, (answer: string) => {
                    if (this.isCorrectResponse(answer)) {
                        this.clearMistake();
                    } else {
                        this.showMistake(answer);
                    }
                    this.consecutiveFailures = 0;
                    this.isChecking = false;
                });
            },
            () => {
                print("[Scan] Error: encodeTextureAsync failed");
                this.consecutiveFailures += 1;
                this.handleScanError();
            },
            CompressionQuality.LowQuality,
            EncodingType.Jpg
        );
    }

    private sendToChatGPT(dataUri: string, callback: (response: string) => void) {
        OpenAI.chatCompletions({
            model: 'gpt-4o',
            messages: [
                {
                    role: 'system',
                    content: "You are a math tutor. Review the math in the provided image. If there is a mistake, reply ONLY with a short correction. If the math is correct, or if there is no math visible, reply with the exact word: CORRECT."
                },
                {
                    role: 'user',
                    content: [
                        { type: "text", text: "Check this math." },
                        {
                            type: "image_url",
                            image_url: { url: dataUri }
                        }
                    ]
                }
            ],
            temperature: 0.2,
        })
            .then((response) => {
                print("[Raw API Payload] " + JSON.stringify(response, null, 2));
                const answer = response?.choices?.[0]?.message?.content?.trim() ?? "CORRECT";
                print("[Scan] AI Response: " + answer);
                // Function here
                callback(answer);
            })
            .catch((error) => {
                print("[Scan] Error: " + error);
                this.consecutiveFailures += 1;
                this.handleScanError();
                this.isChecking = false;
            });
    }

    private handleScanError() {
        if (this.consecutiveFailures >= 3) {
            this.scanDisabled = true;
            print("[Scan] Disabled after 3 consecutive failures.");
        }
    }

    private isCorrectResponse(answer: string): boolean {
        const normalized = answer.toUpperCase().replace(/[.\s]/g, "");
        return normalized === "CORRECT";
    }
}
