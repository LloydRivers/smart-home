import { IEvent, ISubscriber, ILogger } from "../interfaces";

export class Sprinkler implements ISubscriber {
  private isOn: boolean = false;

  constructor(
    private name: string,
    private logger: ILogger
  ) {}

  getName(): string {
    return `Sprinkler (${this.name})`;
  }

  update(event: IEvent): void {
    if (event.type === "SMOKE_DETECTED") {
      if (!this.isOn) {
        this.isOn = true;
        this.logger.info(`[${this.getName()}] Activated due to ${event.type}`);
      } else {
        this.logger.info(
          `[${this.getName()}] Already activated due to ${event.type}`
        );
      }
    }
  }
}
