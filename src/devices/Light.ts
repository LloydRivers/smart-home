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
    if (!this.isOn) {
      this.isOn = true;
      this.logger.info(`[Light] ${this.name} turned ON due to ${event.type}`);
    } else {
      this.logger.info(
        `[Light] ${this.name} is already ON (event: ${event.type})`
      );
    }
  }
}
