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

    private lastWasCorrect: boolean | null = null;
    private lastExplanation: string = "";
    public handleAiAnswer(answer: string): void {
        const raw = (answer ?? "").trim();
        const normalized = raw.toUpperCase().replace(/[.\s]/g, "");
        const isCorrect = normalized === "CORRECT";
        // repeated CORRECT => no UI churn
        if (isCorrect) {
            if (this.lastWasCorrect === true) return;
            this.lastWasCorrect = true;
            this.lastExplanation = "";
            this.clearMistake();
            return;
        }
        // non-correct: update only when explanation changes
        if (this.lastWasCorrect === false && raw === this.lastExplanation) {
            return;
        }
        this.lastWasCorrect = false;
        this.lastExplanation = raw;
        this.showMistake(raw);
    }

    private isCorrectResponse(answer: string): boolean {
        const normalized = answer.toUpperCase().replace(/[.\s]/g, "");
        return normalized === "CORRECT";
    }
}
