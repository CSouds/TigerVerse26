@component
export class TrackState extends BaseScriptComponent {
  private selectedMode: string = "Tutoring";

  setMode(mode: string): void {
    this.selectedMode = mode;
    print("Mode selected: " + this.selectedMode);
  }

  getMode(): string {
    return this.selectedMode;
  }
}