import { describe, expect, it, vi } from "vitest";
import { EventBus } from "../core/EventBus";
import { ConsoleLogger } from "../utils/Logger";
import { IntruderAlarm } from "./IntruderAlarm";

const logger = new ConsoleLogger();
const eventBus = new EventBus(logger);

vi.spyOn(logger, "error").mockImplementation(vi.fn());
vi.spyOn(eventBus, "publish").mockImplementation(vi.fn());

describe("IntruderAlarm", () => {
  const token = "correct-token";
  const intruderAlarm = new IntruderAlarm(eventBus, logger, token);

  it("SHOULD log intruder detected and publish event if token is correct", () => {
    intruderAlarm.detectIntruder();

    expect(logger.error).toHaveBeenCalledWith(
      "[IntruderAlert] Intruder detected! Publishing event..."
    );
    expect(eventBus.publish).toHaveBeenCalledWith({
      type: "INTRUDER_ALERT",
      timestamp: expect.any(Date),
      payload: { location: "Back Door" },
      token,
    });
  });
});
