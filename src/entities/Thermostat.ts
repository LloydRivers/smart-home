export class Thermostat {
  private isActive: boolean;
  private _temperature: number;

  constructor(initialTemperature: number) {
    this.isActive = false;
    this.temperature = initialTemperature;
  }

  get temperature(): number {
    return this._temperature;
  }

  set temperature(value: number) {
    this.temperature = value;
  }
}
