import { IEvent, ISubscriber, ILogger } from "../interfaces";

export class Lambda implements ISubscriber {
  constructor(private logger: ILogger) {}

  getName(): string {
    return "Lambda";
  }

  update(event: IEvent): void {
    this.logger.info(`[Lambda] Processing event: ${event.type}`);

    // Transforming and republishing the event generically
    this.logger.info(`[Lambda] Republishing as STORE_EVENT and LOG_EVENT`);
  }
}
