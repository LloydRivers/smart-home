import { ConsoleLogger } from '../utils/Logger';
import { SmartHomeSystem } from './SmartHomeSystem';

const logger = new ConsoleLogger();

describe('Feature: EnergyEfficiency', () => {
  it.only('SHOULD create a new EnergyControl instance correctly', () => {
    const energyControl = new SmartHomeSystem(logger, []);
    expect(energyControl).toBeInstanceOf(SmartHomeSystem);
    expect(energyControl).toMatchInlineSnapshot(`
        EnergyControl {
          "_observers": Set {},
          "logger": ConsoleLogger {},
          "thermostats": [],
        }
    `);
  });
});

//   describe('Methods: ', () => {
//     describe('GETTERS: ', () => {
//       it.only('temperature: SHOULD return the correct temperature', () => {
//         const energyControl = new EnergyControl(logger, []);
//         const newThermostat = new Thermostat({
//           energyControl,
//           initialTemperature: 25,
//         });

//         energyControl.subscribe(newThermostat);

//         expect(energyControl.observers).toEqual(new Set([newThermostat]));
//       });

//       it('isActive: SHOULD return the correct activation state', () => {
//         const thermostat = new Thermostat({
//           energyControl,
//           initialTemperature: 30,
//         });
//         expect(thermostat.isActive).toEqual(false);
//       });
//     });

//     describe('SETTERS: ', () => {
//       it('temperature: SHOULD set the temperature correctly', () => {
//         const thermostat = new Thermostat({
//           energyControl,
//           initialTemperature: 30,
//         });
//         thermostat.temperature = 19;
//         expect(thermostat.temperature).toEqual(19);
//       });
//     });

//     it('activate: SHOULD set the isActive state to true', () => {
//       const thermostat = new Thermostat({
//         energyControl,
//         initialTemperature: 30,
//       });
//       thermostat.activate();
//       expect(thermostat.isActive).toEqual(true);
//     });

//     it('deactivate: SHOULD set the isActive state to true', () => {
//       const thermostat = new Thermostat({
//         energyControl,
//         initialTemperature: 30,
//       });
//       thermostat.activate(); // make sure the thermostat is active before deactivating it
//       thermostat.deactivate();
//       expect(thermostat.isActive).toEqual(false);
//     });

//     it('test implementations/updates');
//   });
// });
