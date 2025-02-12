import { IEvent, ISubscriber, ILogger } from "../interfaces";
import { EventBus } from "../core/EventBus";

export class Lambda implements ISubscriber {
  private eventBus: EventBus;

  constructor(
    private logger: ILogger,
    eventBus: EventBus
  ) {
    this.eventBus = eventBus;
  }

  getName(): string {
    return "Lambda";
  }

  update(event: IEvent): void {
    this.logger.info(`[Lambda] Processing event: ${event.type}`);

    // Switch logic to handle different event types
    switch (event.type) {
      case "SMOKE_DETECTED":
        this.logger.error(
          `[Lambda] Smoke detected! Republishing as STORE_EVENT and LOG_EVENT`
        );
        this.republishStoreEvent(event);
        break;

      case "INTRUDER_ALERT":
        this.logger.info(
          `[Lambda] Intruder alert detected! Republishing as STORE_EVENT and LOG_EVENT`
        );
        this.republishStoreEvent(event);
        break;

      default:
        this.logger.warn(`[Lambda] Unhandled event type: ${event.type}`);
        break;
    }
  }

  private republishStoreEvent(event: IEvent): void {
    this.eventBus.publish({
      type: "STORE_EVENT_IN_BUCKET",
      timestamp: new Date(),
      payload: event.payload,
      token: event.token,
    });
  }
}
