import {
  IEvent,
  IEventDispatcher,
  ISmokeAlarm,
  ISubscriber,
} from "../interfaces";

export class Light implements ISubscriber {
  private isOn: boolean = false;
  private name: string; // Added name property

  constructor(
    smokeAlarm: ISmokeAlarm,
    private eventDispatcher: IEventDispatcher,
    name: string // Pass name as a parameter
  ) {
    this.name = name; // Set the name during instantiation
    smokeAlarm.subscribe(this);
  }

  getIsOn(): boolean {
    return this.isOn;
  }
  getName(): string {
    return this.name;
  }

  update(event: IEvent): void {
    if (event.type === "SMOKE_DETECTED") {
      this.eventDispatcher.dispatchEvent(event);
    }
  }

  setIsOn(isOn: boolean): void {
    this.isOn = isOn;
    // Log the action with the light's name
    console.log(
      `${this.name} light has been ${isOn ? "turned on" : "turned off"}`
    );
  }
}
