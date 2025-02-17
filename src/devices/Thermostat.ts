import { IEvent, ILogger, ISubscriber } from "../interfaces";

export class Thermostat implements ISubscriber {
  private _temperature: number;
  private _isActive: boolean = true;

  constructor(
    private name: string,
    private logger: ILogger,
    initialTemperature: number
  ) {
    this._temperature = initialTemperature;
  }

  getName(): string {
    return `Thermostat (${this.name})`;
  }

  // setIsActive(state: boolean): void {
  //   this.smartHomeSystem.isActive = state;
  // }

  // set temperature(newTemperature: number) {
  //   this._temperature = newTemperature;
  // }

  get temperature(): number {
    return this._temperature;
  }

  get isActive(): boolean {
    return this._isActive;
  }

  display(): void {
    console.log(
      `Thermostat display: Status: ${
        this._isActive ? "ON" : "OFF"
      }, Temperature: ${this.temperature}°C`
    );
  }

  update(event: IEvent): void {
    switch (event.type) {
      // case "CHANGE_THERMOSTAT":
      //   if()
      //   this.temperature = event.payload.;
      //   this.logger.info(
      //     `[${this.getName()}] changing temperature to ${this.temperature}°C due to ${event.type}`
      //   );
      //   this.display();
      //   break;
      case "BED_TIME_MODE":
        this._isActive = true;
        this._temperature = 17;
        this.logger.info(
          `[${this.getName()}] changing temperature to ${this.temperature}°C due to ${event.type}`
        );
        break;
      case "COMFORT_MODE":
        this._isActive = true;
        this._temperature = 22;
        this.logger.info(
          `[${this.getName()}] changing temperature to ${this.temperature}°C due to ${event.type}`
        );
        break;
      case "AWAY_MODE":
        this._isActive = false;
        this.logger.info(`[${this.getName()}] is off due to ${event.type}`);
        break;
    }
  }
}
