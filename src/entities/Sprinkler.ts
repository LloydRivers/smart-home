export class Sprinkler {
  private active: boolean = false;

  getActive(): boolean {
    return this.active;
  }

  setActive(state: boolean): void {
    this.active = state;
  }
}
