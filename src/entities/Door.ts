import { Observable } from "../base/Observable";

export class Door extends Observable {
  private locked: boolean = true;

  setLocked(state: boolean): void {
    this.locked = state;
    this.notify({
      type: "DOOR_UPDATE",
      timestamp: new Date(),
      payload: { action: "lock", state },
    });
  }

  getLocked(): boolean {
    return this.locked;
  }
}
