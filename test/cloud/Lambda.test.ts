import { describe, beforeEach, it, expect, vi } from "vitest";
import { Lambda } from "../../src/cloud/Lambda";
import { EventBus } from "../../src/core/EventBus";
import { IEvent, ILogger } from "../../src/interfaces";

describe("Lambda", () => {
  const createMockLogger = (): ILogger => ({
    debug: vi.fn(),
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
  });

  class TestEventBus extends EventBus {
    constructor(logger: ILogger) {
      super(logger);
      this.publish = vi.fn();
    }
  }

  let lambda: Lambda;
  let mockLogger: ILogger;
  let testEventBus: TestEventBus;

  beforeEach(() => {
    mockLogger = createMockLogger();
    testEventBus = new TestEventBus(mockLogger);
    lambda = new Lambda(mockLogger, testEventBus);
  });

  describe("getName", () => {
    it("should return the correct subscriber name", () => {
      expect(lambda.getName()).toBe("Lambda");
    });
  });

  describe("update", () => {
    const createTestEvent = (type: string): IEvent => ({
      type,
      timestamp: new Date(),
      payload: { test: "data" },
      token: "test-token",
    });

    it("should handle SMOKE_DETECTED events correctly", () => {
      const smokeEvent = createTestEvent("SMOKE_DETECTED");

      lambda.update(smokeEvent);

      expect(mockLogger.info).toHaveBeenCalledWith(
        "[Lambda] Processing event: SMOKE_DETECTED"
      );
      expect(mockLogger.error).toHaveBeenCalledWith(
        "[Lambda] Smoke detected! Republishing as STORE_EVENT and LOG_EVENT"
      );

      expect(testEventBus.publish).toHaveBeenCalledWith({
        type: "STORE_EVENT_IN_BUCKET",
        timestamp: expect.any(Date),
        payload: smokeEvent.payload,
        token: smokeEvent.token,
      });
    });

    it("should handle INTRUDER_ALERT events correctly", () => {
      const intruderEvent = createTestEvent("INTRUDER_ALERT");

      lambda.update(intruderEvent);

      expect(mockLogger.info).toHaveBeenCalledWith(
        "[Lambda] Processing event: INTRUDER_ALERT"
      );
      expect(mockLogger.info).toHaveBeenCalledWith(
        "[Lambda] Intruder alert detected! Republishing as STORE_EVENT and LOG_EVENT"
      );

      expect(testEventBus.publish).toHaveBeenCalledWith({
        type: "STORE_EVENT_IN_BUCKET",
        timestamp: expect.any(Date),
        payload: intruderEvent.payload,
        token: intruderEvent.token,
      });
    });

    it("should handle unknown event types with a warning", () => {
      const unknownEvent = createTestEvent("UNKNOWN_TYPE");

      lambda.update(unknownEvent);

      expect(mockLogger.warn).toHaveBeenCalledWith(
        "[Lambda] Unhandled event type: UNKNOWN_TYPE"
      );
      expect(testEventBus.publish).not.toHaveBeenCalled();
    });

    it("should preserve event payload and token when republishing", () => {
      const customEvent = createTestEvent("SMOKE_DETECTED");
      customEvent.payload = { customData: "test" };
      customEvent.token = "special-token";

      lambda.update(customEvent);

      expect(testEventBus.publish).toHaveBeenCalledWith(
        expect.objectContaining({
          payload: { customData: "test" },
          token: "special-token",
        })
      );
    });

    it("should create a new timestamp when republishing events", () => {
      const oldDate = new Date("2023-01-01");
      const event = createTestEvent("SMOKE_DETECTED");
      event.timestamp = oldDate;

      lambda.update(event);

      const publishCall = vi.mocked(testEventBus.publish).mock.calls[0][0];
      expect(publishCall.timestamp).not.toEqual(oldDate);
      expect(publishCall.timestamp.getTime()).toBeGreaterThan(
        oldDate.getTime()
      );
    });
  });
});
