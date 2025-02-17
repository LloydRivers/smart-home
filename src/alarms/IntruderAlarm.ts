import { ILogger, IEventBus } from "../interfaces";

export class IntruderAlarm {
  private token: string;

  constructor(
    private eventBus: IEventBus,
    private logger: ILogger,
    token: string
  ) {
    this.token = token;
  }
  // Prevent Unauthorized Access
  private hasToken(token: string): boolean {
    return token === this.token;
  }

  detectIntruder(): void {
    if (!this.hasToken(this.token)) {
      this.logger.error("[IntruderAlert] Unauthorized access detected!");
      return;
    }

    this.logger.error("[IntruderAlert] Intruder detected! Publishing event...");
    this.eventBus.publish({
      type: "INTRUDER_ALERT",
      timestamp: new Date(),
      payload: { location: "Back Door" },
      token: this.token,
    });
  }
}
