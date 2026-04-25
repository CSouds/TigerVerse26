@component
export class Selector extends BaseScriptComponent {
  @input
  textOutput: Text;
  private options: string[] = ["Option 1", "Option 2", "Option 3"];
  private currentIndex: number = 0;
  onAwake(): void {
    this.updateText();
  }
  nextOption(): void {
    if (this.options.length === 0) {
      this.textOutput.text = "";
      return;
    }
    this.currentIndex = (this.currentIndex + 1) % this.options.length;
    this.updateText();
  }

  previousOption(): void {
    if (this.options.length === 0) {
      this.textOutput.text = "";
      return;
    }
    this.currentIndex = (this.currentIndex - 1 + this.options.length) % this.options.length;
    this.updateText();
  }

  private updateText(): void {
    if (!this.textOutput) {
      return;
    }
    this.textOutput.text = this.options[this.currentIndex] ?? "";
  }
}