@component
export class ShowFeedback extends BaseScriptComponent {

    @input
    interactable!: any;

    @input
    textComponent!: Text;

    @input
    textBubbleContainer!: SceneObject;

    private isBoundToInteractable = false;

    onAwake() {
        // Always hide the bubble on startup so it is not visible by default.
        if (this.textBubbleContainer) {
            this.textBubbleContainer.enabled = false;
        }

        print("ShowFeedback: onAwake");
        this.bindInteractionEvent();

        // Temporary debug fallback: in simulation this proves display logic works
        // even when Interactable pinch events do not fire.
        this.createEvent("TapEvent").bind(() => {
            print("ShowFeedback: TapEvent fallback fired");
            this.displayFeedback();
        });
    }

    bindInteractionEvent() {
        if (!this.interactable) {
            print("Warning: Interactable component is not linked.");
            return;
        }

        const eventSource = this.interactable.api ? this.interactable.api : this.interactable;
        print(
            "ShowFeedback: binding from " +
            (this.interactable.api ? "interactable.api" : "interactable")
        );
        const possibleEvents = [
            "onTriggerStart", // Pinch/trigger in Spectacles Interaction Kit
            "onPinchDown",
            "onPinchStart",
            "onTap", // Fallback for tap-based interactions
            "onTrigger",
        ];

        for (let i = 0; i < possibleEvents.length; i++) {
            const eventName = possibleEvents[i];
            const event = eventSource[eventName];
            print(
                "ShowFeedback: checking event " +
                eventName +
                " exists=" +
                (event ? "true" : "false")
            );
            if (this.tryBindEvent(event, () => {
                    print("ShowFeedback: Interactable event fired: " + eventName);
                    this.displayFeedback();
                })) {
                print("ShowFeedback bound to interaction event: " + eventName);
                this.isBoundToInteractable = true;
                return;
            }
        }

        print("Warning: Interactable has no supported interaction event.");
    }

    tryBindEvent(event: any, callback: () => void): boolean {
        if (!event) {
            return false;
        }

        if (event.add) {
            event.add(callback);
            return true;
        }

        if (event.addCallback) {
            event.addCallback(callback);
            return true;
        }

        if (event.bind) {
            event.bind(callback);
            return true;
        }

        return false;
    }

    displayFeedback() {
        print(
            "ShowFeedback: displayFeedback (boundToInteractable=" +
            (this.isBoundToInteractable ? "true" : "false") +
            ")"
        );
        const aiFeedback: string = this.fetchAiMistakeData(); 

        if (this.textComponent) {
            this.textComponent.text = aiFeedback;
        } else {
            print("ShowFeedback: textComponent missing");
        }

        if (this.textBubbleContainer) {
            this.textBubbleContainer.enabled = true;
        } else {
            print("ShowFeedback: textBubbleContainer missing");
        }
    }

    fetchAiMistakeData(): string {
        return "Check your math: 2 + 2 = 4, not 5.";
    }
}
