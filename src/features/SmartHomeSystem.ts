import { Observable } from '../base/Observable';
import { ILogger } from '../interfaces';

export interface TemperatureControl {
  _isActive: boolean;
  _temperature: number;
}

export class SmartHomeSystem extends Observable {
  private _temperatureControl: TemperatureControl;
  constructor(logger: ILogger, temperatureControl: TemperatureControl) {
    super(logger);
    this._temperatureControl = temperatureControl;
  }

  set temperature(newTemperature: number) {
    if (newTemperature < 10 || newTemperature > 30) {
      throw new Error('Temperature is out of valid range');
    }
    this._temperatureControl._temperature = newTemperature;
    this.notify({
      type: 'TEMPERATURE_CHANGE',
      timestamp: new Date(),
      payload: this.temperatureControl._temperature,
    });
  }

  set isActive(isActive: boolean) {
    this._temperatureControl._isActive = isActive;
    this.notify({
      type: 'ISACTIVE_CHANGE',
      timestamp: new Date(),
      payload: this.temperatureControl._isActive,
    });
  }

  get temperatureControl(): TemperatureControl {
    return this._temperatureControl;
  }

  // setAwayMode(): void {
  //   this.notify({
  //     type: 'AWAY',
  //     timestamp: new Date(),
  //     payload: this.temperatureControl,
  //   });
  // }
}
