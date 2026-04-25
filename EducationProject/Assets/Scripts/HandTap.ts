@component
export class HandTap extends BaseScriptComponent {
  private interaction: InteractionComponent | null = null;

  onAwake(): void {
    const so = this.getSceneObject();
    this.interaction = so.getComponent("InteractionComponent") as InteractionComponent | null;

    if (!this.interaction) {
      print("HandTap: no InteractionComponent on " + so.name);
      return;
    }

    this.interaction.onTap.add(() => {
      print("[Tapped on] " + so.name);
    });
  }
}