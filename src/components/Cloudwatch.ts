import { ISubscriber, IEvent, ILogger, ICloudwatch } from "../interfaces";

export class Cloudwatch implements ISubscriber, ICloudwatch {
  private metrics: IEvent[] = [];
  private logger: ILogger;
  public name: string; // Add a name property

  constructor(logger: ILogger, name: string) {
    this.logger = logger;
    this.name = name; // Assign the name during construction
  }

  update(event: IEvent): void {
    this.metrics.push(event);
    this.processMetric(event);
  }

  processMetric(event: IEvent): void {
    // Log event details with the logger, including the Cloudwatch instance name
    this.logger.info(
      `[${this.name}] Received event: [${event.timestamp.toISOString()}] ${
        event.type
      }`,
      event.payload
    );
  }

  getMetrics(eventType?: string): IEvent[] {
    return eventType
      ? this.metrics.filter((m) => m.type === eventType)
      : [...this.metrics];
  }
}
