import { vi } from "vitest";
import { Publisher } from "../src/base/Publisher";
import { ISubscriber, ILogger, IEvent } from "../src/interfaces";

class MockSubscriber implements ISubscriber {
  update(event: IEvent): void {}
}

class MockLogger implements ILogger {
  debug = vi.fn();
  info = vi.fn();
  warn = vi.fn();
  error = vi.fn();
}

class ConcreteObservable extends Publisher {
  constructor(logger: ILogger) {
    super(logger);
  }
}

describe("Publisher", () => {
  let publisher: Publisher;
  let logger: MockLogger;
  let subscriber: MockSubscriber;

  beforeEach(() => {
    logger = new MockLogger();
    publisher = new ConcreteObservable(logger);
    subscriber = new MockSubscriber();
  });

  it("should log info when an subscriber is subscribed", () => {
    publisher.subscribe(subscriber);
    expect(logger.info).toHaveBeenCalledWith("Subscriber subscribed", {
      subscriber,
    });
  });

  it("should log warn when an subscriber is already subscribed", () => {
    publisher.subscribe(subscriber);
    publisher.subscribe(subscriber);
    expect(logger.warn).toHaveBeenCalledWith("Subscriber already subscribed", {
      subscriber,
    });
  });

  it("should log info when an subscriber is unsubscribed", () => {
    publisher.subscribe(subscriber);
    publisher.unsubscribe(subscriber);
    expect(logger.info).toHaveBeenCalledWith("Subscriber unsubscribed", {
      subscriber,
    });
  });

  it("should log warn when an subscriber is not subscribed", () => {
    publisher.unsubscribe(subscriber);
    expect(logger.warn).toHaveBeenCalledWith("Subscriber not subscribed", {
      subscriber,
    });
  });

  it("should log warn when there are no subscribers to notify", () => {
    const event: IEvent = {
      type: "test",
      timestamp: new Date(),
      payload: "test",
    };
    publisher.notify(event);
    expect(logger.warn).toHaveBeenCalledWith("No subscribers to notify");
  });

  it("should log info when notifying subscribers", () => {
    const event: IEvent = {
      type: "test",
      timestamp: new Date(),
      payload: "test",
    };
    publisher.subscribe(subscriber);
    publisher.notify(event);
    expect(logger.info).toHaveBeenCalledWith("Notifying subscribers", {
      event,
    });
  });

  it("should call update on subscribers when notifying", () => {
    const event: IEvent = {
      type: "test",
      timestamp: new Date(),
      payload: "test",
    };
    const updateSpy = vi.spyOn(subscriber, "update");
    publisher.subscribe(subscriber);
    publisher.notify(event);
    expect(updateSpy).toHaveBeenCalledWith(event);
  });
});
