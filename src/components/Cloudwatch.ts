import { IObserver, IEvent, ILogger } from "../interfaces";

export class Cloudwatch implements IObserver {
  private metrics: IEvent[] = [];
  private logger: ILogger;

  constructor(logger: ILogger) {
    this.logger = logger;
  }

  update(event: IEvent): void {
    this.metrics.push(event);
    this.processMetric(event);
  }

  private processMetric(event: IEvent): void {
    // Log event details with the logger
    this.logger.info(
      `Received event: [${event.timestamp.toISOString()}] ${event.type}`,
      event.payload
    );
  }

  getMetrics(eventType?: string): IEvent[] {
    return eventType
      ? this.metrics.filter((m) => m.type === eventType)
      : [...this.metrics];
  }
}
