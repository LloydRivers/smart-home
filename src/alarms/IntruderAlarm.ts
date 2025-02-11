import { ILogger, IEventBus } from "../interfaces";

export class IntruderAlarm {
  constructor(
    private eventBus: IEventBus,
    private logger: ILogger
  ) {}

  detectIntruder(): void {
    this.logger.info("[IntruderAlert] Intruder detected! Publishing event...");
    this.eventBus.publish({
      type: "INTRUDER_ALERT",
      timestamp: new Date(),
      payload: { location: "Back Door" },
    });
  }
}
