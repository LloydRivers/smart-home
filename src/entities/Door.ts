import { Observable } from "../base/Observable";

export class Door extends Observable {
  private locked: boolean = true;

  setLocked(state: boolean): void {
    const action = state ? "lock" : "unlock";
    this.locked = state;
    this.notify({
      type: "DOOR_UPDATE",
      timestamp: new Date(),
      payload: { action: "lock", state },
    });

    this.logger.info(`Door has been ${action}ed`);
  }

  getLocked(): boolean {
    return this.locked;
  }
}
