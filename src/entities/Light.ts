import { Observable } from "../base/Observable";

export class Light extends Observable {
  private state: boolean = false;

  setOn(state: boolean): void {
    this.state = state;
    this.notify({
      type: "LIGHT_UPDATE",
      timestamp: new Date(),
      payload: { action: "on", state },
    });
  }

  getOn(): boolean {
    return this.state;
  }
}
