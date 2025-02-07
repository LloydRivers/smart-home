export class Thermostat {
  private _isActive: boolean;
  private _temperature: number;

  constructor(initialTemperature: number) {
    this._isActive = false;
    this._temperature = initialTemperature;
  }

  get temperature(): number {
    return this._temperature;
  }

  set temperature(value: number) {
    this._temperature = value;
  }

  get isActive(): boolean {
    return this._isActive;
  }

  activate(): void {
    this._isActive = true;
  }

  deactivate(): void {
    this._isActive = false;
  }
}
