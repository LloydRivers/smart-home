import { IEvent, ISubscriber, ILogger } from "../interfaces";

export class CloudWatch implements ISubscriber {
  private metrics: IEvent[] = [];

  constructor(private logger: ILogger) {}

  getName(): string {
    return "CloudWatch";
  }

  update(event: IEvent): void {
    this.logger.info(`[${this.getName()}] Logging event:`, event);
    this.metrics.push(event);
  }
}
