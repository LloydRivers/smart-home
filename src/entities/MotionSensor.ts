import { Observable } from "../base/Observable";

export class MotionSensor extends Observable {
  private occupants: number = 0;

  getOccupants(): number {
    return this.occupants;
  }
}
