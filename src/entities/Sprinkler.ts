import {
  IEvent,
  ISubscriber,
  IEventDispatcher,
  ISmokeAlarm,
} from "../interfaces";

export class Sprinkler implements ISubscriber {
  private active: boolean = false;
  private name: string;

  constructor(
    smokeAlarm: ISmokeAlarm,
    private eventDispatcher: IEventDispatcher,
    name: string
  ) {
    this.name = name;
    smokeAlarm.subscribe(this);
  }

  getActive(): boolean {
    return this.active;
  }

  getName(): string {
    return this.name;
  }

  update(event: IEvent): void {
    if (event.type === "SMOKE_DETECTED") {
      console.log(`[INFO] ${this.name} received SMOKE_DETECTED event.`);
      this.eventDispatcher.dispatchEvent(event);
    }
  }

  setActive(active: boolean): void {
    this.active = active;
  }
}
