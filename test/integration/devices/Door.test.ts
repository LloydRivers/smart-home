import { Door } from "@src/devices/Door";
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

describe("Door", () => {
  it("SHOULD return the correct name", () => {
    const door = new Door("Front Door", logger);

    expect(door.getName()).toBe("Door (Front Door)");
  });

  it("SHOULD log 'Locking due to [event type]' when the door locks", () => {
    const door = new Door("Front Door", logger);

    door.update(event); // Unlocks the door first
    door.update(event); // Locks the door

    expect(logger.info).toHaveBeenCalledWith(
      "[Door (Front Door)] Locking due to EVENT_TYPE"
    );
  });

  it("SHOULD log 'Unlocking due to [event type]' when the door unlocks", () => {
    const door = new Door("Front Door", logger);

    door.update(event); // Unlocks the door

    expect(logger.info).toHaveBeenCalledWith(
      "[Door (Front Door)] Unlocking due to EVENT_TYPE"
    );
  });

  it("SHOULD toggle the locked state correctly on update", () => {
    const door = new Door("Front Door", logger);

    expect(door["locked"]).toBe(true); // Initially locked

    door.update(event);
    expect(door["locked"]).toBe(false); // Should be unlocked

    door.update(event);
    expect(door["locked"]).toBe(true); // Should be locked again
  });
});
