import { Observable } from "../base/Observable";

export class Sprinkler extends Observable {
  private active: boolean = false;

  getActive(): boolean {
    return this.active;
  }

  setActive(state: boolean): void {
    this.active = state;
    this.notify({
      type: "SPRINKLER_UPDATE",
      timestamp: new Date(),
      payload: { action: "active", state },
    });
  }
}
