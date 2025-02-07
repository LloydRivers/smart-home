export class Door {
  private locked: boolean = true;

  setLocked(state: boolean): void {
    this.locked = state;
  }

  getLocked(): boolean {
    return this.locked;
  }
}
