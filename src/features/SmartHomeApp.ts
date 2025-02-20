import { IEventBus } from "../interfaces";
import { TimeOfDayPeriod, isWithinAnyPeriod } from "../utils/isWithinAnyPeriod";

export class SmartHomeApp {
  private token: string;
  constructor(
    private name: string,
    private eventBus: IEventBus,
    token: string
  ) {
    this.token = token;
  }

  getName(): string {
    return `App for home (${this.name})`;
  }

  setBedTimeMode(): void {
    this.eventBus.publish({
      type: "BED_TIME_MODE",
      timestamp: new Date(),
      payload: null,
      token: this.token,
    });
  }

  setComfortMode(): void {
    this.eventBus.publish({
      type: "COMFORT_MODE",
      timestamp: new Date(),
      payload: null,
      token: this.token,
    });
  }

  setAwayMode(): void {
    this.eventBus.publish({
      type: "AWAY_MODE",
      timestamp: new Date(),
      payload: null,
      token: this.token,
    });
  }

  checkSchedule(
    bedtimeSchedule: TimeOfDayPeriod[],
    comfortSchedule: TimeOfDayPeriod[],
    awaySchedule: TimeOfDayPeriod[]
  ): void {
    if (isWithinAnyPeriod(bedtimeSchedule)) {
      this.setBedTimeMode();
    }
    if (isWithinAnyPeriod(comfortSchedule)) {
      this.setComfortMode();
    }
    if (isWithinAnyPeriod(awaySchedule)) {
      this.setAwayMode();
    }
  }
}
