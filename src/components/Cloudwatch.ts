import { IObserver, IEvent } from "../interfaces";

export class Cloudwatch implements IObserver {
  private metrics: IEvent[] = [];

  update(event: IEvent): void {
    this.metrics.push(event);
    this.processMetric(event);
  }

  private processMetric(event: IEvent): void {
    console.log(
      `[${event.timestamp.toISOString()}] ${event.type}:`,
      event.payload
    );
  }

  getMetrics(eventType?: string): IEvent[] {
    return eventType
      ? this.metrics.filter((m) => m.type === eventType)
      : [...this.metrics];
  }
}
