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

    async performContinuousScan() {
        if (this.isChecking) return;
        this.isChecking = true;
        print("[Scan] Capturing frame and sending to AI...");

        try {
            const base64Image = await new Promise<string>((resolve, reject) => {
                Base64.encodeTextureAsync(
                    this.cameraFeed,
                    (res: string) => resolve(res),
                    () => reject("Camera frame encoding failed"),
                    CompressionQuality.LowQuality,
                    EncodingType.Jpg
                );
            });

            const dataUri = `data:image/jpeg;base64,${base64Image}`;

            const response = await OpenAI.chatCompletions({
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
            });

            const answer = response?.choices?.[0]?.message?.content?.trim() ?? "CORRECT";
            print("[Scan] AI Response: " + answer);

            if (this.isCorrectResponse(answer)) {
                this.clearMistake();
            } else {
                this.showMistake(answer);
            }

        } catch (error) {
            print("[Scan] Error: " + error);
        } finally {
            this.isChecking = false;
        }
    }

    private isCorrectResponse(answer: string): boolean {
        const normalized = answer.toUpperCase().replace(/[.\s]/g, "");
        return normalized === "CORRECT";
    }
}
