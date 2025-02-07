export class Light {
  private state: boolean = false;

  setOn(state: boolean): void {
    this.state = state;
  }

  getOn(): boolean {
    return this.state;
  }
}
