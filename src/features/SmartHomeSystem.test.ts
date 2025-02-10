import { vi } from 'vitest';
import { ConsoleLogger } from '../utils/Logger';
import { SmartHomeSystem, TemperatureControl } from './SmartHomeSystem';

const logger = new ConsoleLogger();
const temperatureControl: TemperatureControl = {
  _isActive: false,
  _temperature: 29,
};
const smartHomeSystem = new SmartHomeSystem(logger, temperatureControl);
const mockedDate = new Date('2024-02-09T12:00:00Z');

const notifySpy = vi.spyOn(smartHomeSystem, 'notify');

beforeEach(() => {
  vi.setSystemTime(mockedDate);
});

afterEach(() => {
  vi.useRealTimers();
  vi.clearAllMocks();
});

describe('Feature: EnergyEfficiency', () => {
  it('SHOULD create a new EnergyControl instance correctly', () => {
    expect(smartHomeSystem).toBeInstanceOf(SmartHomeSystem);
    expect(smartHomeSystem).toMatchInlineSnapshot(`
      SmartHomeSystem {
        "_temperatureControl": {
          "_isActive": false,
          "_temperature": 29,
        },
        "logger": ConsoleLogger {},
        "observers": Set {},
      }
    `);
  });
});

describe('Methods: ', () => {
  describe('GETTERS: ', () => {
    it('temperatureControl: SHOULD return the correct temperature control values', () => {
      expect(smartHomeSystem.temperatureControl).toEqual(temperatureControl);
    });
  });

  describe('SETTERS: ', () => {
    describe('temperature: ', () => {
      it('SHOULD set the new temperature correctly WHEN it is within acceptable range', () => {
        smartHomeSystem.temperature = 10;

        expect(smartHomeSystem.temperatureControl._temperature).toEqual(10);
        expect(notifySpy).toHaveBeenCalledWith({
          type: 'TEMPERATURE_CHANGE',
          timestamp: mockedDate,
          payload: smartHomeSystem.temperatureControl._temperature,
        });
      });

      it('SHOULD NOT set the new temperature correctly WHEN it is NOT within acceptable range', () => {
        expect(() => {
          smartHomeSystem.temperature = 5;
        }).toThrow('Temperature is out of valid range');
      });
    });

    it('isActive: SHOULD set the isActive state correctly', () => {
      smartHomeSystem.isActive = true;
      expect(smartHomeSystem.temperatureControl._isActive).toEqual(true);
      expect(notifySpy).toHaveBeenCalledWith({
        type: 'ISACTIVE_CHANGE',
        timestamp: mockedDate,
        payload: smartHomeSystem.temperatureControl._isActive,
      });
    });
  });
});
