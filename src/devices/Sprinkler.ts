import { IEvent, ISubscriber, ILogger } from "../interfaces";

export class Sprinkler implements ISubscriber {
  constructor(
    private name: string,
    private logger: ILogger
  ) {}

  getName(): string {
    return `Sprinkler (${this.name})`;
  }

  update(event: IEvent): void {
    if (event.type === "SMOKE_DETECTED") {
      this.logger.info(`[${this.getName()}] Activating due to smoke!`, event);
    }
  }
}
