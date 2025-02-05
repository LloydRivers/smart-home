export class MotionSensor {
  private occupants: number = 0;

  getOccupants(): number {
    return this.occupants;
  }
}