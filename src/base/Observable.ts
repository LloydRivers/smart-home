import { IEvent, IObservable, IObserver, ILogger } from "../interfaces";

export abstract class Observable implements IObservable {
  private observers: Set<IObserver> = new Set();
  private logger: ILogger;

  // Dependency Injection for logger
  constructor(logger: ILogger) {
    this.logger = logger;
  }

  subscribe(observer: IObserver): void {
    this.observers.add(observer);
    this.logger.info(`Observer subscribed`, { observer });
  }

  unsubscribe(observer: IObserver): void {
    this.observers.delete(observer);
    this.logger.info("Observer unsubscribed", { observer });
  }

  notify(event: IEvent): void {
    this.logger.info("Notifying observers", { event });
    this.observers.forEach((observer) => observer.update(event));
  }
}
