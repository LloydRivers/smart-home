import { Publisher } from "../base/Publisher";
import { ILogger } from "../interfaces";

export class SmokeAlarm extends Publisher {
  private smokeDetected: boolean = false;

  constructor(logger: ILogger) {
    super(logger, "SmokeAlarm");
  }

  detectSmoke(): void {
    this.smokeDetected = true;
    this.logger.warn("Smoke detected! Triggering fire safety systems.");

    this.notify({
      type: "SMOKE_DETECTED",
      timestamp: new Date(),
      payload: { action: "detected" },
    });
  }

  clearSmoke(): void {
    this.smokeDetected = false;
    this.logger.info("Smoke cleared. Fire safety systems reset.");

    this.notify({
      type: "SMOKE_ALARM",
      timestamp: new Date(),
      payload: { action: "cleared" },
    });
  }

  isSmokeDetected(): boolean {
    return this.smokeDetected;
  }
}
