import { ILogger, IEventBus } from "../interfaces";

export class SmokeAlarm {
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

  detectSmoke(): void {
    if (!this.hasToken(this.token)) {
      this.logger.error("[SmokeAlarm] Unauthorized access detected!");
      return;
    }

    this.logger.error("[SmokeAlarm] Smoke detected! Publishing event...");
    this.eventBus.publish({
      type: "SMOKE_DETECTED",
      timestamp: new Date(),
      payload: { location: "Kitchen" },
      token: this.token,
    });
  }
}
