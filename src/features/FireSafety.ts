import {
  IEvent,
  ISubscriber,
  ISmokeAlarm,
  IEventDispatcher,
} from "../interfaces";

export class FireSafety implements ISubscriber {
  constructor(
    smokeAlarm: ISmokeAlarm,
    private eventDispatcher: IEventDispatcher
  ) {
    smokeAlarm.subscribe(this);
    // We also do lambda.subscribe(this)
  }

  update(event: IEvent): void {
    if (event.type === "SMOKE_DETECTED") {
      this.eventDispatcher.dispatchEvent(event);
    }
  }
}
