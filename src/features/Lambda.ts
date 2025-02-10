import { IEvent, IEventBus, ISubscriber, ILogger } from "../interfaces";

export class Lambda implements ISubscriber {
  constructor(private eventBus: IEventBus, private logger: ILogger) {
    this.eventBus.subscribe("SMOKE_DETECTED", this);
  }

  getName(): string {
    return "Lambda";
  }

  update(event: IEvent): void {
    this.logger.info("[Lambda] Processing smoke alarm...");

    // Publishing events to other components
    this.eventBus.publish({
      type: "STORE_EVENT",
      timestamp: new Date(),
      payload: event,
    });

    this.eventBus.publish({
      type: "LOG_EVENT",
      timestamp: new Date(),
      payload: event,
    });
  }
}
