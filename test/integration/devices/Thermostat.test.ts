import { Thermostat } from "@src/devices/Thermostat";
import { IEvent } from "@src/interfaces";
import { ConsoleLogger } from "@src/utils/Logger";
import { vi } from "vitest";

const logger = new ConsoleLogger();
const thermostat = new Thermostat("MyThermo", logger, 20);
const loggerInfo = vi.spyOn(logger, "info").mockImplementation(vi.fn());

describe("Entity: Thermostat", () => {
  it("SHOULD create a new Thermostat instance correctly", () => {
    expect(thermostat).toBeInstanceOf(Thermostat);
    expect(thermostat).toMatchInlineSnapshot(`
      Thermostat {
        "_isActive": true,
        "_temperature": 20,
        "logger": ConsoleLogger {},
        "name": "MyThermo",
      }
    `);
  });

  describe("Methods: ", () => {
    it("getName: SHOULD get the correct thermostat name", () => {
      expect(thermostat.getName()).toEqual("Thermostat (MyThermo)");
    });

    it("display: SHOULD display the correct thermostat info", () => {
      const consoleSpy = vi.spyOn(console, "log");

      thermostat.display();
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining(
          `Thermostat display: Status: ON, Temperature: 20°C`
        )
      );
    });
  });

  describe("update: ", () => {
    const makeEvent = (type: string): IEvent => ({
      type,
      timestamp: new Date(),
      payload: "payload",
      token: "token",
    });

    it("WHEN the event is BED_TIME_MODE it should set the temperature appropriately", () => {
      const event = makeEvent("BED_TIME_MODE");

      thermostat.update(event);

      expect(thermostat.isActive).toBe(true);
      expect(thermostat.temperature).toBe(17);
      expect(loggerInfo).toHaveBeenLastCalledWith(
        "[Thermostat (MyThermo)] changing temperature to 17°C due to BED_TIME_MODE"
      );
    });

    it("WHEN the event is COMFORT_MODE it should set the temperature appropriately", () => {
      const event = makeEvent("COMFORT_MODE");

      thermostat.update(event);

      expect(thermostat.isActive).toBe(true);
      expect(thermostat.temperature).toBe(22);
      expect(loggerInfo).toHaveBeenLastCalledWith(
        "[Thermostat (MyThermo)] changing temperature to 22°C due to COMFORT_MODE"
      );
    });

    it("WHEN the event is AWAY_MODE it should set the isActive state appropriately", () => {
      const event = makeEvent("AWAY_MODE");

      thermostat.update(event);
      expect(thermostat.isActive).toBe(false);
      expect(loggerInfo).toHaveBeenLastCalledWith(
        "[Thermostat (MyThermo)] is off due to AWAY_MODE"
      );
    });
  });
});
