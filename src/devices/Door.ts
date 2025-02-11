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
    this.logger.info(`[${this.getName()}] Unlocking due to ${event.type}!`);
    this.locked = false;
  }
}
