@component
export class HideOnStart extends BaseScriptComponent {
    @input
    target!: SceneObject;

    onAwake() {
        if (this.target) {
            this.target.enabled = false;
        } else {
            print("HideOnStart: No target assigned.");
        }
    }
}
