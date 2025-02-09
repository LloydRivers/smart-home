import {
  IEvent,
  ISubscriber,
  IEventDispatcher,
  ISmokeAlarm,
  ILogger,
} from "../interfaces";

export class Door implements ISubscriber {
  private locked: boolean = true;
  private name: string;

  constructor(
    smokeAlarm: ISmokeAlarm,
    private eventDispatcher: IEventDispatcher,
    private logger: ILogger,
    name: string
  ) {
    this.name = name;
    smokeAlarm.subscribe(this);
  }

  getName(): string {
    return this.name;
  }

  getLocked(): boolean {
    return this.locked;
  }

  update(event: IEvent): void {
    if (event.type === "SMOKE_DETECTED") {
      this.eventDispatcher.dispatchEvent(event);
    }
  }

  setLocked(state: boolean): void {
    this.locked = state;
    const action = state ? "locked" : "unlocked";

    // Updated log to include the door name
    this.logger.info(`${this.name} has been ${action}`);
  }
}
