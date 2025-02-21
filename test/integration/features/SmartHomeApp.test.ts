import { SmartHomeApp } from "@src/features/SmartHomeApp";
import { IEventBus } from "@src/interfaces";
import { TimeOfDayPeriod } from "@src/utils/isWithinAnyPeriod";
import { vi } from "vitest";

describe("SmartHomeApp", () => {
  const eventBus: IEventBus = {
    publish: vi.fn(),
    subscribe: vi.fn(),
  };
  const app: SmartHomeApp = new SmartHomeApp("Home", eventBus, "token");

  const bedtimeSchedule: TimeOfDayPeriod[] = [
    {
      start: { hour: 22, minute: 0 },
      end: { hour: 5, minute: 59 },
    },
  ];
  const comfortSchedule: TimeOfDayPeriod[] = [
    {
      start: { hour: 6, minute: 0 },
      end: { hour: 8, minute: 59 },
    },
    {
      start: { hour: 17, minute: 0 },
      end: { hour: 21, minute: 59 },
    },
  ];
  const awaySchedule: TimeOfDayPeriod[] = [
    {
      start: { hour: 9, minute: 0 },
      end: { hour: 16, minute: 59 },
    },
  ];

  it("SHOULD publish BED_TIME_MODE when within bedtime schedule", () => {
    vi.setSystemTime(new Date("2025-02-18T23:00:00Z"));
    app.checkSchedule(bedtimeSchedule, comfortSchedule, awaySchedule);

    expect(eventBus.publish).toHaveBeenCalledWith({
      type: "BED_TIME_MODE",
      timestamp: expect.any(Date),
      payload: null,
      token: "token",
    });
  });

  it("SHOULD publish COMFORT_MODE when within comfort schedule", () => {
    vi.setSystemTime(new Date("2025-02-18T18:00:00Z"));
    app.checkSchedule(bedtimeSchedule, comfortSchedule, awaySchedule);

    expect(eventBus.publish).toHaveBeenCalledWith({
      type: "COMFORT_MODE",
      timestamp: expect.any(Date),
      payload: null,
      token: "token",
    });
  });

  it("SHOULD publish AWAY_MODE when within away schedule", () => {
    vi.setSystemTime(new Date("2025-02-18T10:00:00Z"));
    app.checkSchedule(bedtimeSchedule, comfortSchedule, awaySchedule);

    expect(eventBus.publish).toHaveBeenCalledWith({
      type: "AWAY_MODE",
      timestamp: expect.any(Date),
      payload: null,
      token: "token",
    });
  });
});
