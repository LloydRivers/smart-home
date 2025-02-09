import {
  SmartHomeSystem,
  TemperatureControl,
} from '../features/SmartHomeSystem';
import { IEvent, IObserver } from '../interfaces';

export class Thermostat implements IObserver {
  private smartHomeSystem: SmartHomeSystem;

  constructor(smartHomeSystem: SmartHomeSystem) {
    this.smartHomeSystem = smartHomeSystem;
    smartHomeSystem.subscribe(this);
  }

  setIsActive(state: boolean): void {
    this.smartHomeSystem.isActive = state;
  }

  setTemperature(newTemperature: number): void {
    this.smartHomeSystem.temperature = newTemperature;
  }

  display(payload: TemperatureControl): void {
    console.log(
      `Thermostat display: Status: ${
        payload._isActive ? 'ON' : 'OFF'
      }, Temperature: ${payload._temperature}°C`
    );
  }

  update(event: IEvent): void {
    if (['TEMPERATURE_CHANGE', 'ISACTIVE_CHANGE'].includes(event.type)) {
      this.display(event.payload);
    }
  }
}
