@component
export class ShowFeedback extends BaseScriptComponent {

    @input
    interactable!: any;

    @input
    textComponent!: Text;

    @input
    textBubbleContainer!: SceneObject;

    onAwake() {
        if (this.textBubbleContainer) {
            this.textBubbleContainer.enabled = false;
        }

        this.createEvent("OnStartEvent").bind(() => {
            if (!this.interactable) {
                print("ShowFeedback: Interactable not linked.");
                return;
            }
            this.interactable.onTriggerStart.add(() => {
                this.displayFeedback();
            });
        });
    }

    displayFeedback() {
        if (this.textComponent) {
            this.textComponent.text = this.fetchAiMistakeData();
        }
        if (this.textBubbleContainer) {
            this.textBubbleContainer.enabled = true;
        }
    }

    fetchAiMistakeData(): string {
        return "Check your math: 2 + 2 = 4, not 5.";
    }
}
