@component
export class Selector extends BaseScriptComponent {
  @input
  textOutput: Text;

  @input
  @hint("Optional TrackState script to persist selected mode.")
  @allowUndefined
  modeStateController?: any;

  private options: string[] = ["Tutoring", "Checking", "Answer Key"];
  private currentIndex: number = 0;

  onAwake(): void {
    this.updateText();
  }
  nextOption(): void {
    print("Selector: nextOption triggered");
    if (this.options.length === 0) {
      this.textOutput.text = "";
      return;
    }
    this.currentIndex = (this.currentIndex + 1) % this.options.length;
    this.updateText();
  }

  previousOption(): void {
    print("Selector: previousOption triggered");
    if (this.options.length === 0) {
      this.textOutput.text = "";
      return;
    }
    this.currentIndex = (this.currentIndex - 1 + this.options.length) % this.options.length;
    this.updateText();
  }

  private updateText(): void {
    const selected = this.options[this.currentIndex] ?? "";

    if (!this.textOutput) {
      this.pushModeToState(selected);
      return;
    }
    this.textOutput.text = selected;
    this.pushModeToState(selected);
  }

  private pushModeToState(mode: string): void {
    try {
      const controller = this.modeStateController as any;
      if (controller && typeof controller.setMode === "function") {
        print("Selector: pushing mode -> " + mode);
        controller.setMode(mode);
      } else {
        print("Selector: modeStateController missing setMode");
      }
    } catch (error) {
      print("Selector: failed to push mode to TrackState: " + String(error ?? ""));
    }
  }
}