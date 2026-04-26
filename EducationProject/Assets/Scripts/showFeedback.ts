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

    public handleAiAnswer(answer: string): void {
        if (this.isCorrectResponse(answer)) {
            this.clearMistake();
        } else {
            this.showMistake(answer);
        }
    }

    private isCorrectResponse(answer: string): boolean {
        const normalized = answer.toUpperCase().replace(/[.\s]/g, "");
        return normalized === "CORRECT";
    }
}
