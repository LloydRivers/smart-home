import { EventBus } from "@src/core/EventBus";
import { IEvent, ISubscriber } from "@src/interfaces";
import { ConsoleLogger } from "@src/utils/Logger";
import { describe, expect, it, vi } from "vitest";

afterEach(() => {
  vi.clearAllMocks();
});

const logger = new ConsoleLogger();
const validEvent: IEvent = {
  type: "EVENT_TYPE",
  timestamp: new Date(),
  payload: "payload",
  token: "HOME_OWNER",
};

const invalidEvent: IEvent = {
  type: "EVENT_TYPE",
  timestamp: new Date(),
  payload: "payload",
  token: "INVALID_TOKEN",
};

const subscriber: ISubscriber = {
  getName: () => "TestSubscriber",
  update: vi.fn(),
};

vi.spyOn(logger, "info").mockImplementation(vi.fn());
vi.spyOn(logger, "warn").mockImplementation(vi.fn());
vi.spyOn(logger, "error").mockImplementation(vi.fn());

describe("EventBus", () => {
  it("SHOULD subscribe a subscriber to an event type", () => {
    const eventBus = new EventBus(logger);

    eventBus.subscribe("EVENT_TYPE", subscriber);

    expect(eventBus["subscribers"].get("EVENT_TYPE")?.length).toBe(1);
    expect(logger.info).toHaveBeenCalledWith(
      "[EventBus] TestSubscriber subscribed to EVENT_TYPE"
    );
  });

  it("SHOULD publish a valid event and notify subscribers", () => {
    const eventBus = new EventBus(logger);

    eventBus.subscribe("EVENT_TYPE", subscriber);
    eventBus.publish(validEvent);

    expect(logger.info).toHaveBeenCalledWith(
      `[EventBus] Full Event Details:\n${JSON.stringify(validEvent, null, 2)}`
    );
    expect(logger.warn).toHaveBeenCalledWith(
      "[EventBus] Notifying TestSubscriber about EVENT_TYPE"
    );
    expect(subscriber.update).toHaveBeenCalledWith(validEvent);
  });

  it("SHOULD not notify subscribers for an unauthorized event", () => {
    const eventBus = new EventBus(logger);

    eventBus.subscribe("EVENT_TYPE", subscriber);
    eventBus.publish(invalidEvent);

    expect(logger.error).toHaveBeenCalledWith(
      "[Security] Unauthorized event detected: EVENT_TYPE"
    );
    expect(subscriber.update).not.toHaveBeenCalled();
  });

  it("SHOULD log if there are no subscribers for an event type", () => {
    const eventBus = new EventBus(logger);

    eventBus.publish(validEvent);

    expect(logger.info).toHaveBeenCalledWith(
      "[EventBus] No subscribers for EVENT_TYPE"
    );
  });

  it("SHOULD clear all subscriptions", () => {
    const eventBus = new EventBus(logger);

    eventBus.subscribe("EVENT_TYPE", subscriber);
    eventBus.clearSubscriptions();

    expect(eventBus["subscribers"].size).toBe(0);
  });
});
