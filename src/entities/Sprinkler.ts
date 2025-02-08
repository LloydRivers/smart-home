import { Publisher } from "../base/Publisher";

export class Sprinkler extends Publisher {
  private active: boolean = false;

  getActive(): boolean {
    return this.active;
  }

  setActive(state: boolean): void {
    const action = state ? "on" : "off";
    this.active = state;
    this.notify({
      type: "SPRINKLER_UPDATE",
      timestamp: new Date(),
      payload: { action: "active", state },
    });

    this.logger.info(`Sprinkler has been turned ${action}`);
  }
}
