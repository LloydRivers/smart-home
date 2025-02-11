import { IEvent, ISubscriber, ILogger } from "../interfaces";

export class Door implements ISubscriber {
  private locked: boolean = true;

  constructor(
    private name: string,
    private logger: ILogger
  ) {}

  getName(): string {
    return `Door (${this.name})`;
  }

  update(event: IEvent): void {
    if (this.locked) {
      this.locked = false;
      this.logger.info(`[${this.getName()}] Unlocked due to ${event.type}`);
    } else {
      this.logger.info(
        `[${this.getName()}] Already unlocked (event: ${event.type})`
      );
    }
  }
}
