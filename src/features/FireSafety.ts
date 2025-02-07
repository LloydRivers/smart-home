import {
  IEvent,
  IObserver,
  ISmokeAlarm,
  IEventDispatcher,
} from "../interfaces";

export class FireSafety implements IObserver {
  constructor(
    smokeAlarm: ISmokeAlarm,
    private eventDispatcher: IEventDispatcher
  ) {
    smokeAlarm.subscribe(this);
  }

  update(event: IEvent): void {
    if (event.type === "SMOKE_DETECTED") {
      this.eventDispatcher.dispatchEvent(event);
    }
  }
}
