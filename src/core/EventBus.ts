import { IEvent, ISubscriber, ILogger } from "../interfaces";

export class EventBus {
  private subscribers: Map<string, ISubscriber[]> = new Map();
  private logger: ILogger;

  constructor(logger: ILogger) {
    this.logger = logger;
  }

  private authCheck(event: IEvent): boolean {
    const VALID_TOKENS = ["HOME_OWNER"];
    return VALID_TOKENS.includes(event.token);
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
    if (!this.authCheck(event)) {
      this.logger.error(
        `[Security] Unauthorized event detected: ${event.type}`
      );
      return;
    }
    this.logger.info(
      `[EventBus] Full Event Details:\n${JSON.stringify(event, null, 2)}`
    );

    this.notifySubscribers(event.type, event);
  }

  private notifySubscribers(eventType: string, event: IEvent) {
    const subscribers = this.subscribers.get(eventType) || [];
    if (subscribers.length === 0) {
      this.logger.info(`[EventBus] No subscribers for ${eventType}`);
      return;
    }

    subscribers.forEach((subscriber) => {
      this.logger.warn(
        `[EventBus] Notifying ${subscriber.getName()} about ${eventType}`
      );
      subscriber.update(event);
    });
  }

  clearSubscriptions(): void {
    this.subscribers = new Map();
  }
}
