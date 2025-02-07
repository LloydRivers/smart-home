import { Observable } from "../base/Observable";

export class MotionSensor extends Observable {
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
