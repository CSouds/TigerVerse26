import TrackedHand from "SpectaclesInteractionKit.lspkg/Providers/HandInputData/TrackedHand";
import { SIK } from "SpectaclesInteractionKit.lspkg/SIK";

@component
export class PalmToggle extends BaseScriptComponent {

    @input
    hudContainer!: SceneObject;

    @input
    palmCenter!: SceneObject;

    @input
    cameraObject!: SceneObject;

    @input
    @widget(new ComboBoxWidget()
        .addItem("left", 0)
        .addItem("right", 1))
    @hint("Which hand to track for visibility gating.")
    handSide: number = 0;

    @input
    @hint("Dot product threshold. Palm facing camera when dot < threshold (typical: -0.5).")
    facingThreshold: number = -0.5;

    @input
    @hint("World-space offset from the palm to the HUD (Y+ floats it above the hand).")
    positionOffset: vec3 = new vec3(0, 10, 0);

    @input
    @hint("If true, HUD rotation matches the palm rotation.")
    matchRotation: boolean = false;

    private hand: TrackedHand | null = null;

    onAwake() {
        if (this.hudContainer) {
            this.hudContainer.enabled = false;
        }

        this.createEvent("OnStartEvent").bind(() => {
            try {
                this.hand = SIK.HandInputData.getHand(this.handSide === 0 ? "left" : "right");
            } catch (e) {
                print("PalmToggle: SIK hand init failed: " + e);
            }
        });

        this.createEvent("UpdateEvent").bind(() => {
            this.checkPalmVisibility();
        });
    }

    checkPalmVisibility() {
        if (!this.hudContainer || !this.palmCenter || !this.cameraObject) return;

        if (!this.hand || !this.hand.isTracked()) {
            if (this.hudContainer.enabled) {
                this.hudContainer.enabled = false;
            }
            return;
        }

        const palmTransform = this.palmCenter.getTransform();
        const palmRot = palmTransform.getWorldRotation();
        const camRot = this.cameraObject.getTransform().getWorldRotation();

        const camForward = camRot.multiplyVec3(new vec3(0, 0, -1));
        const palmForward = palmRot.multiplyVec3(new vec3(0, 0, 1));
        const dotProduct = palmForward.dot(camForward);

        const isFacing = dotProduct < this.facingThreshold;

        if (isFacing) {
            const palmPos = palmTransform.getWorldPosition();
            const hudTransform = this.hudContainer.getTransform();

            hudTransform.setWorldPosition(new vec3(
                palmPos.x + this.positionOffset.x,
                palmPos.y + this.positionOffset.y,
                palmPos.z + this.positionOffset.z
            ));

            if (this.matchRotation) {
                hudTransform.setWorldRotation(palmRot);
            }

            this.hudContainer.enabled = true;
        } else {
            this.hudContainer.enabled = false;
        }
    }
}
