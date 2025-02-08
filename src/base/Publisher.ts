import { IEvent, ISubscriber, ILogger } from "../interfaces";

export abstract class Publisher {
  private subscribers: Set<ISubscriber> = new Set();
  protected logger: ILogger;

  constructor(logger: ILogger) {
    this.logger = logger;
  }

  subscribe(subscriber: ISubscriber): void {
    if (this.subscribers.has(subscriber)) {
      this.logger.warn("Subscriber already subscribed", { subscriber });
      return;
    }

    this.subscribers.add(subscriber);
    this.logger.info("Subscriber subscribed", { subscriber });
  }

  unsubscribe(subscriber: ISubscriber): void {
    if (!this.subscribers.has(subscriber)) {
      this.logger.warn("Subscriber not subscribed", { subscriber });
      return;
    }

    this.subscribers.delete(subscriber);
    this.logger.info("Subscriber unsubscribed", { subscriber });
  }

  notify(event: IEvent): void {
    if (this.subscribers.size === 0) {
      this.logger.warn("No subscribers to notify");
      return;
    }

    this.logger.info("Notifying subscribers", { event });
    this.subscribers.forEach((subscriber) => {
      subscriber.update(event);
    });
  }
}
