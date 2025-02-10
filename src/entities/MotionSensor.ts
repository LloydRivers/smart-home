export class MotionSensor {
  private occupants: number = 0;

  setOccupants(ocupants: number): void {
    this.occupants = ocupants
  }

  getOccupants(): number {
    return this.occupants;
  }
}