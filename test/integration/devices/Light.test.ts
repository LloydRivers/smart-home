import { Light } from "@src/devices/Light";
import { IEvent } from "@src/interfaces";
import { ConsoleLogger } from "@src/utils/Logger";
import { vi } from "vitest";

const logger = new ConsoleLogger();
const event: IEvent = {
  type: "EVENT_TYPE",
  timestamp: new Date(),
  payload: "payload",
  token: "token",
};

vi.spyOn(logger, "info").mockImplementation(vi.fn());

describe("Light", () => {
  it("SHOULD return the correct name", () => {
    const light = new Light("Living Room", logger);

    expect(light.getName()).toBe("[Light] Living Room");
  });

  it("SHOULD log 'Reacting to [event type]' when updating", () => {
    const light = new Light("Living Room", logger);

    light.update(event);

    expect(logger.info).toHaveBeenCalledWith("[Light] Reacting to EVENT_TYPE");
  });

  it("SHOULD log 'turned ON due to [event type]' when the light turns on", () => {
    const light = new Light("Living Room", logger);

    light.update(event); // Turns the light ON

    expect(logger.info).toHaveBeenCalledWith(
      "[Light] Living Room turned ON due to EVENT_TYPE"
    );
  });

  it("SHOULD log 'turned OFF due to [event type]' when the light turns off", () => {
    const light = new Light("Living Room", logger);

    light.update(event); // Turns the light ON
    light.update(event); // Turns the light OFF

    expect(logger.info).toHaveBeenCalledWith(
      "[Light] Living Room turned OFF due to EVENT_TYPE"
    );
  });

  it("SHOULD toggle the isOn state correctly on update", () => {
    const light = new Light("Living Room", logger);

    expect(light["isOn"]).toBe(false); // Initially off

    light.update(event);
    expect(light["isOn"]).toBe(true); // Should be on

    light.update(event);
    expect(light["isOn"]).toBe(false); // Should be off again
  });
});
