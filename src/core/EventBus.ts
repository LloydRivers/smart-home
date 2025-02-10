import { IEvent, ISubscriber, ILogger } from "../interfaces";

export class EventBus {
  private subscribers: Map<string, ISubscriber[]> = new Map();
  private logger: ILogger;

  constructor(logger: ILogger) {
    this.logger = logger;
  }

  subscribe(eventType: string, subscriber: ISubscriber): void {
    if (!this.subscribers.has(eventType)) {
      this.subscribers.set(eventType, []);
    }
    this.subscribers.get(eventType)!.push(subscriber);
    this.logger.info(
      `[EventBus] ${subscriber.getName()} subscribed to ${eventType}`
    );
  }

  publish(event: IEvent): void {
    this.logger.info(`[EventBus] Publishing event: ${event.type}`);
    const subscribers = this.subscribers.get(event.type) || [];

    subscribers.forEach((subscriber) => {
      this.logger.info(`[EventBus] Notifying ${subscriber.getName()}`);
      subscriber.update(event);
    });
  }
}
