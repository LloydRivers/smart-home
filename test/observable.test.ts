import { vi } from "vitest";
import { Observable } from "../src/base/Observable";
import { IObserver, ILogger, IEvent } from "../src/interfaces";

class MockObserver implements IObserver {
  update(event: IEvent): void {}
}

class MockLogger implements ILogger {
  debug = vi.fn();
  info = vi.fn();
  warn = vi.fn();
  error = vi.fn();
}

class ConcreteObservable extends Observable {
  constructor(logger: ILogger) {
    super(logger);
  }
}

describe("Observable", () => {
  let observable: Observable;
  let logger: MockLogger;
  let observer: MockObserver;

  beforeEach(() => {
    logger = new MockLogger();
    observable = new ConcreteObservable(logger);
    observer = new MockObserver();
  });

  it("should log info when an observer is subscribed", () => {
    observable.subscribe(observer);
    expect(logger.info).toHaveBeenCalledWith("Observer subscribed", {
      observer,
    });
  });

  it("should log warn when an observer is already subscribed", () => {
    observable.subscribe(observer);
    observable.subscribe(observer);
    expect(logger.warn).toHaveBeenCalledWith("Observer already subscribed", {
      observer,
    });
  });

  it("should log info when an observer is unsubscribed", () => {
    observable.subscribe(observer);
    observable.unsubscribe(observer);
    expect(logger.info).toHaveBeenCalledWith("Observer unsubscribed", {
      observer,
    });
  });

  it("should log warn when an observer is not subscribed", () => {
    observable.unsubscribe(observer);
    expect(logger.warn).toHaveBeenCalledWith("Observer not subscribed", {
      observer,
    });
  });

  it("should log warn when there are no observers to notify", () => {
    const event: IEvent = {
      type: "test",
      timestamp: new Date(),
      payload: "test",
    };
    observable.notify(event);
    expect(logger.warn).toHaveBeenCalledWith("No observers to notify");
  });

  it("should log info when notifying observers", () => {
    const event: IEvent = {
      type: "test",
      timestamp: new Date(),
      payload: "test",
    };
    observable.subscribe(observer);
    observable.notify(event);
    expect(logger.info).toHaveBeenCalledWith("Notifying observers", { event });
  });

  it("should call update on observers when notifying", () => {
    const event: IEvent = {
      type: "test",
      timestamp: new Date(),
      payload: "test",
    };
    const updateSpy = vi.spyOn(observer, "update");
    observable.subscribe(observer);
    observable.notify(event);
    expect(updateSpy).toHaveBeenCalledWith(event);
  });
});
