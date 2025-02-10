import { SmartHomeSystem } from '../features/SmartHomeSystem';
import { IEvent, IObserver } from '../interfaces';

export class Thermostat implements IObserver {
  private smartHomeSystem: SmartHomeSystem;
  private _temperature: number;
  private _isActive: boolean;

  constructor(smartHomeSystem: SmartHomeSystem) {
    this.smartHomeSystem = smartHomeSystem;
    this._temperature = smartHomeSystem.temperatureControl._temperature;
    this._isActive = smartHomeSystem.temperatureControl._isActive;

    smartHomeSystem.subscribe(this);
  }

  setIsActive(state: boolean): void {
    this.smartHomeSystem.isActive = state;
  }

  setTemperature(newTemperature: number): void {
    this.smartHomeSystem.temperature = newTemperature;
  }

  display(): void {
    console.log(
      `Thermostat display: Status: ${
        this._isActive ? 'ON' : 'OFF'
      }, Temperature: ${this._temperature}°C`
    );
  }

  update(event: IEvent): void {
    switch (event.type) {
      case 'TEMPERATURE_CHANGE':
        this._temperature = event.payload;
        this.display();
        break;
      case 'ISACTIVE_CHANGE':
        this._isActive = event.payload;
        this.display();
        break;
    }
  }
}
