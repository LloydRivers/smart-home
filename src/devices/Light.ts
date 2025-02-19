import { IEvent, ISubscriber, ILogger } from "../interfaces";

export class Light implements ISubscriber {
  private isOn: boolean = false;
  private name: string;
  private logger: ILogger;

  constructor(name: string, logger: ILogger) {
    this.name = name;
    this.logger = logger;
  }

  getName(): string {
    return `[Light] ${this.name}`;
  }

  update(event: IEvent): void {
    this.logger.info(`[Light] Reacting to ${event.type}`);
    this.isOn = !this.isOn;
    if (this.isOn) {
      this.logger.info(`[Light] ${this.name} turned ON due to ${event.type}`);
      return;
    }
    this.logger.info(`[Light] ${this.name} turned OFF due to ${event.type}`);
  }
}
