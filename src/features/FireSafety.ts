import {
    IEvent,
    ISubscriber,
    ISmokeAlarm,
    IEventDispatcher,
  } from "../interfaces";
import { Sprinkler } from  "../entities/Sprinklers"
import { MotionSensor } from "../entities/MotionSensor";
import { Light } from "../entities/Light"
import { Door } from "../entities/Door"
  
  export class FireSafety implements ISubscriber {
    private sprinklers: Sprinkler[];
    private occupancySensor: MotionSensor;
    private doors: Door[];
    private lights: Light[];

    constructor(
        smokeAlarm: ISmokeAlarm,
        private eventDispatcher: IEventDispatcher,
        sprinklers: Sprinkler[],
        occupancySensor: MotionSensor,
        doors: Door[],
        lights: Light[]
    ) {
        smokeAlarm.subscribe(this);
        // We also do lambda.subscribe(this)
        this.sprinklers = sprinklers;
        this.occupancySensor = occupancySensor;
        this.doors = doors;
        this.lights = lights;
    }
  
    getName(): string {
        return "FireSafety";
    }

    update(event: IEvent): void {
        if (event.type !== "SMOKE_DETECTED") {
            return;
        }

        this.eventDispatcher.dispatchEvent(event);
    
        if (this.occupancySensor.getOccupants() > 0) {
            this.sprinklers.forEach((sprinkler) => {
                sprinkler.setActive(true)
            });
        }

        this.doors.forEach(door => {
            door.setLocked(false);
        })

        this.lights.forEach(light => {
            light.setOn(true);
        })
    }
}
  
