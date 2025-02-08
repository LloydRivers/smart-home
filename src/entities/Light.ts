import { Publisher } from "../base/Publisher";

export class Light extends Publisher {
  private state: boolean = false;

  setOn(state: boolean): void {
    const action = state ? "on" : "off";
    this.state = state;
    this.notify({
      type: "LIGHT_UPDATE",
      timestamp: new Date(),
      payload: { action: "on", state },
    });

    this.logger.info(`Light has been turned ${action}`);
  }

  getOn(): boolean {
    return this.state;
  }
}
