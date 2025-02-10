import { IEvent, IEventBus, ISubscriber, ILogger } from "../interfaces";

export class CloudWatch implements ISubscriber {
  private metrics: IEvent[] = [];

  constructor(
    private eventBus: IEventBus,
    private logger: ILogger
  ) {
    this.eventBus.subscribe("SMOKE_DETECTED", this);
  }

  getName(): string {
    return "CloudWatch";
  }

  update(event: IEvent): void {
    this.logger.info(`[${this.getName()}] Logging event:`, event);
    this.metrics.push(event);
  }
}
