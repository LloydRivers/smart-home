import { describe, expect, it, vi } from "vitest";
import { EventBus } from "../core/EventBus";
import { ConsoleLogger } from "../utils/Logger";
import { SmokeAlarm } from "./SmokeAlarm";

const logger = new ConsoleLogger();
const eventBus = new EventBus(logger);

vi.spyOn(logger, "error").mockImplementation(vi.fn());
vi.spyOn(eventBus, "publish").mockImplementation(vi.fn());

describe("SmokeAlarm", () => {
  const token = "correct-token";
  const smokeAlarm = new SmokeAlarm(eventBus, logger, token);

  it("SHOULD log smoke detected and publish event if token is correct", () => {
    smokeAlarm.detectSmoke();

    expect(logger.error).toHaveBeenCalledWith(
      "[SmokeAlarm] Smoke detected! Publishing event..."
    );
    expect(eventBus.publish).toHaveBeenCalledWith({
      type: "SMOKE_DETECTED",
      timestamp: expect.any(Date),
      payload: { location: "Kitchen" },
      token,
    });
  });
});
