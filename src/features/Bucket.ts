import { IEvent, IEventBus, ISubscriber, ILogger } from "../interfaces";

export class Bucket implements ISubscriber {
  private storage: Map<string, any> = new Map();

  constructor(private eventBus: IEventBus, private logger: ILogger) {
    this.eventBus.subscribe("SMOKE_DETECTED", this);
  }

  getName(): string {
    return "Bucket";
  }

  update(event: IEvent): void {
    this.logger.info(`[${this.getName()}] Storing event data`, event);
    this.storage.set(event.timestamp.toISOString(), event);
  }
}
