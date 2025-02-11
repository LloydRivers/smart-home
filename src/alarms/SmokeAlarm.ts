import { ILogger, IEventBus } from "../interfaces";

export class SmokeAlarm {
  constructor(
    private eventBus: IEventBus,
    private logger: ILogger
  ) {}

  detectSmoke(): void {
    this.logger.error("[SmokeAlarm] Smoke detected! Publishing event...");
    this.eventBus.publish({
      type: "SMOKE_DETECTED",
      timestamp: new Date(),
      payload: { location: "Kitchen" },
    });
  }
}
