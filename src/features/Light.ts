import { IEvent, IEventBus, ISubscriber, ILogger } from "../interfaces";

export class Light implements ISubscriber {
  private isOn: boolean = false;

  constructor(
    private eventBus: IEventBus,
    private name: string,
    private logger: ILogger
  ) {
    this.eventBus.subscribe("SMOKE_DETECTED", this);
  }

  getName(): string {
    return `Light (${this.name})`;
  }

  update(event: IEvent): void {
    this.logger.info(`[${this.getName()}] Turning on due to smoke!`);
    this.isOn = true;
  }
}
