import { IEvent, IObservable, IObserver, ILogger } from "../interfaces";

export abstract class Observable implements IObservable {
  private observers: Set<IObserver> = new Set();
  private logger: ILogger;

  constructor(logger: ILogger) {
    this.logger = logger;
  }

  subscribe(observer: IObserver): void {
    this.observers.add(observer);
    this.logger.log("INFO", "Observer subscribed", { observer });
  }

  unsubscribe(observer: IObserver): void {
    this.observers.delete(observer);
    this.logger.log("INFO", "Observer unsubscribed", { observer });
  }

  notify(event: IEvent): void {
    this.logger.log("INFO", "Notifying observers", { event });
    this.observers.forEach((observer) => observer.update(event));
  }
}
