import { IEvent, IObservable, IObserver, ILogger } from "../interfaces";

export abstract class Observable implements IObservable {
  private observers: Set<IObserver> = new Set();
  protected logger: ILogger;

  // Dependency Injection for logger
  constructor(logger: ILogger) {
    this.logger = logger;
  }

  subscribe(observer: IObserver): void {
    if (this.observers.has(observer)) {
      this.logger.warn("Observer already subscribed", { observer });
      return;
    }

    this.observers.add(observer);
    this.logger.info("Observer subscribed", { observer });
  }

  unsubscribe(observer: IObserver): void {
    if (!this.observers.has(observer)) {
      this.logger.warn("Observer not subscribed", { observer });
      return;
    }

    this.observers.delete(observer);
    this.logger.info("Observer unsubscribed", { observer });
  }

  notify(event: IEvent): void {
    if (this.observers.size === 0) {
      this.logger.warn("No observers to notify");
      return;
    }

    this.logger.info("Notifying observers", { event });
    this.observers.forEach((observer) => {
      observer.update(event);
    });
  }
}
