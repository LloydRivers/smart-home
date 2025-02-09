import { IEvent, IEventBus, ISubscriber, ILogger } from "../interfaces";

export class Sprinkler implements ISubscriber {
  constructor(
    private eventBus: IEventBus,
    private name: string,
    private logger: ILogger
  ) {
    this.eventBus.subscribe("SMOKE_DETECTED", this);
    this.logger.info(`[Sprinkler] (${this.name}) subscribed to SMOKE_DETECTED`);
  }

  getName(): string {
    return `Sprinkler (${this.name})`;
  }

  update(event: IEvent): void {
    this.logger.info(`[${this.getName()}] Activating due to smoke!`, event);
  }
}
