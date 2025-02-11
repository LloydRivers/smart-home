import { Observable } from "../base/Observable";
import { IObserver, IEvent } from "../interfaces/index";

import { Sprinkler } from  "../entities/Sprinklers"
import { MotionSensor } from "../entities/MotionSensor";
import { Light } from "../entities/Light"
import { Door } from "../entities/Door"

export class FireSafety implements IObserver {
    private sprinklers: Sprinkler[];
    private occupancySensor: MotionSensor;
    private doors: Door[];
    private lights: Light[];
  
    constructor(smokeAlarm: Observable, sprinklers: Sprinkler[], occupancySensor: MotionSensor, doors: Door[], lights: Light[]) {

        this.sprinklers = sprinklers;
        this.occupancySensor = occupancySensor;
        this.doors = doors;
        this.lights = lights;

        smokeAlarm.subscribe(this);
    }
  
    update(event: IEvent): void {
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