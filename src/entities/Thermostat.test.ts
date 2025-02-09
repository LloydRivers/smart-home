import { vi } from 'vitest';
import {
  SmartHomeSystem,
  TemperatureControl,
} from '../features/SmartHomeSystem';
import { IEvent } from '../interfaces';
import { ConsoleLogger } from '../utils/Logger';
import { Thermostat } from './Thermostat';

const payload: TemperatureControl = {
  _isActive: false,
  _temperature: 29,
};

const smartHomeSystem = new SmartHomeSystem(new ConsoleLogger(), payload);

describe('Entity: Thermostat', () => {
  it('SHOULD create a new Thermostat instance correctly', () => {
    const thermostat = new Thermostat(smartHomeSystem);
    expect(thermostat).toBeInstanceOf(Thermostat);
    expect(thermostat).toMatchInlineSnapshot(`
      Thermostat {
        "smartHomeSystem": SmartHomeSystem {
          "_temperatureControl": {
            "_isActive": false,
            "_temperature": 29,
          },
          "logger": ConsoleLogger {},
          "observers": Set {
            Thermostat {
              "smartHomeSystem": [Circular],
            },
            [Circular],
          },
        },
      }
    `);
  });

  describe('Methods: ', () => {
    it('setIsActive: SHOULD set the correct temperature-control state', () => {
      const thermostat = new Thermostat(smartHomeSystem);

      thermostat.setIsActive(true);
      expect(smartHomeSystem.temperatureControl._isActive).toEqual(true);

      thermostat.setIsActive(false);
      expect(smartHomeSystem.temperatureControl._isActive).toEqual(false);
    });

    it('setTemperature: SHOULD set the correct temperature', () => {
      const thermostat = new Thermostat(smartHomeSystem);

      thermostat.setTemperature(15);
      expect(smartHomeSystem.temperatureControl._temperature).toEqual(15);
    });

    it('display: SHOULD display the correct thermostat info', () => {
      const consoleSpy = vi.spyOn(console, 'log');

      const thermostat = new Thermostat(smartHomeSystem);

      thermostat.display(payload);
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining(
          `Thermostat display: Status: OFF, Temperature: 15°C`
        )
      );
    });

    describe('update: ', () => {
      const thermostat = new Thermostat(smartHomeSystem);
      const displaySpy = vi.spyOn(thermostat, 'display');
      const makeEvent = (type: string): IEvent => ({
        type,
        timestamp: new Date(),
        payload,
      });

      it('SHOULD call the display method with the correct param WHEN event is of an appropriate type', () => {
        const event = makeEvent('TEMPERATURE_CHANGE');

        thermostat.update(event);
        expect(displaySpy).toHaveBeenCalledWith(payload);
      });

      it('SHOULD not call the display method WHEN event is not of an appropriate type', () => {
        const event = makeEvent('LIGHT_CHANGE');

        thermostat.update(event);
        expect(displaySpy).not.toHaveBeenCalledWith();
      });
    });
  });
});
