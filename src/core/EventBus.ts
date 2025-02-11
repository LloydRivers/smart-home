import { IEvent, ISubscriber, ILogger } from "../interfaces";

export class EventBus {
  private subscribers: Map<string, ISubscriber[]> = new Map();
  private logger: ILogger;

  private eventMappings: Record<string, string> = {
    SMOKE_DETECTED: "EMERGENCY",
    INTRUDER_ALERT: "SECURITY",
  };

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
    this.logger.info(
      `[EventBus] Full Event Details:\n${JSON.stringify(event, null, 2)}`
    );

    this.notifySubscribers(event.type, event);

    const category = this.eventMappings[event.type];
    if (category) {
      this.logger.info(`[EventBus] Also notifying category: ${category}`);
      this.notifySubscribers(category, event);
    }
  }

  private notifySubscribers(eventType: string, event: IEvent) {
    const subscribers = this.subscribers.get(eventType) || [];
    if (subscribers.length === 0) {
      this.logger.info(`[EventBus] No subscribers for ${eventType}`);
      return;
    }

    subscribers.forEach((subscriber) => {
      this.logger.info(
        `[EventBus] Notifying ${subscriber.getName()} about ${eventType}`
      );
      subscriber.update(event);
    });
  }

  clearSubscriptions(): void {
    this.subscribers = new Map();
  }
}
