import { Thermostat } from './Thermostat';

describe('Entity: Thermostat', () => {
  it('SHOULD create a new Thermostat instance correctly', () => {
    const thermostat = new Thermostat(25);
    expect(thermostat).toBeInstanceOf(Thermostat);
    expect(thermostat).toMatchInlineSnapshot(`
        Thermostat {
          "_isActive": false,
          "_temperature": 25,
        }
    `);
  });

  describe('Methods: ', () => {
    describe('GETTERS: ', () => {
      it('temperature: SHOULD return the correct temperature', () => {
        const thermostat = new Thermostat(30);
        expect(thermostat.temperature).toEqual(30);
      });

      it('isActive: SHOULD return the correct activation state', () => {
        const thermostat = new Thermostat(30);
        expect(thermostat.isActive).toEqual(false);
      });
    });

    describe('SETTERS: ', () => {
      it('temperature: SHOULD set the temperature correctly', () => {
        const thermostat = new Thermostat(30);
        thermostat.temperature = 19;
        expect(thermostat.temperature).toEqual(19);
      });
    });

    it('activate: SHOULD set the isActive state to true', () => {
      const thermostat = new Thermostat(20);
      thermostat.activate();
      expect(thermostat.isActive).toEqual(true);
    });

    it('deactivate: SHOULD set the isActive state to true', () => {
      const thermostat = new Thermostat(20);
      thermostat.activate(); // make sure the thermostat is active before deactivating it
      thermostat.deactivate();
      expect(thermostat.isActive).toEqual(false);
    });
  });
});
