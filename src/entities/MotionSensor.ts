import { Publisher } from "../base/Publisher";

export class MotionSensor extends Publisher {
  private occupants: number = 0;

  getOccupants(): number {
    return this.occupants;
  }

  setOccupants(occupants: number): void {
    this.occupants = occupants;
    this.notify({
      type: "OCCUPANTS_CHANGED",
      timestamp: new Date(),
      payload: { occupants },
    });
  }
}
