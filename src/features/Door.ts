import { IEvent, IEventBus, ISubscriber, ILogger } from "../interfaces";

export class Door implements ISubscriber {
  private locked: boolean = true;

  constructor(
    private eventBus: IEventBus,
    private name: string,
    private logger: ILogger
  ) {
    this.eventBus.subscribe("SMOKE_DETECTED", this);
  }

  getName(): string {
    return `Door (${this.name})`;
  }

  update(event: IEvent): void {
    this.logger.info(`[${this.getName()}] Unlocking due to smoke!`);
    this.locked = false;
  }
}
