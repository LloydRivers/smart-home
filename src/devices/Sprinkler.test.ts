import { describe, expect, it, vi } from "vitest";
import { IEvent } from "../interfaces";
import { ConsoleLogger } from "../utils/Logger";
import { Sprinkler } from "./Sprinkler";

afterEach(() => {
  vi.clearAllMocks();
});

const logger = new ConsoleLogger();
const smokeDetectedEvent: IEvent = {
  type: "SMOKE_DETECTED",
  timestamp: new Date(),
  payload: "payload",
  token: "token",
};

vi.spyOn(logger, "info").mockImplementation(vi.fn());

describe("Sprinkler", () => {
  it("SHOULD return the correct name", () => {
    const sprinkler = new Sprinkler("Garden", logger);

    expect(sprinkler.getName()).toBe("Sprinkler (Garden)");
  });

  it("SHOULD log 'Activated due to SMOKE_DETECTED' when the sprinkler activates", () => {
    const sprinkler = new Sprinkler("Garden", logger);

    sprinkler.update(smokeDetectedEvent);

    expect(logger.info).toHaveBeenCalledWith(
      "[Sprinkler (Garden)] Activated due to SMOKE_DETECTED"
    );
  });

  it("SHOULD log 'Already activated due to SMOKE_DETECTED' when the sprinkler is already on", () => {
    const sprinkler = new Sprinkler("Garden", logger);

    sprinkler.update(smokeDetectedEvent); // Activates the sprinkler
    sprinkler.update(smokeDetectedEvent); // Already activated

    expect(logger.info).toHaveBeenCalledWith(
      "[Sprinkler (Garden)] Already activated due to SMOKE_DETECTED"
    );
  });

  it("SHOULD not activate if event type is not SMOKE_DETECTED", () => {
    const sprinkler = new Sprinkler("Garden", logger);
    const otherEvent: IEvent = {
      type: "OTHER_EVENT",
      timestamp: new Date(),
      payload: "payload",
      token: "token",
    };

    sprinkler.update(otherEvent);

    expect(sprinkler["isOn"]).toBe(false);
    expect(logger.info).not.toHaveBeenCalled();
  });

  it("SHOULD toggle the isOn state correctly on smoke detected events", () => {
    const sprinkler = new Sprinkler("Garden", logger);

    expect(sprinkler["isOn"]).toBe(false); // Initially off

    sprinkler.update(smokeDetectedEvent);
    expect(sprinkler["isOn"]).toBe(true); // Should be on

    sprinkler.update(smokeDetectedEvent);
    expect(sprinkler["isOn"]).toBe(true); // Should remain on
  });
});
