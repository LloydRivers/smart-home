import { describe, it, beforeEach, expect, vi } from "vitest";
import { EventBus } from "../core/EventBus";
import { SmokeAlarm } from "../features/SmokeAlarm";
import { Sprinkler } from "../features/Sprinkler";
import { Door } from "../features/Door";
import { Light } from "../features/Light";
import { CloudWatch } from "../features/CloudWatch";
import { Bucket } from "../features/Bucket";
import { Lambda } from "../features/Lambda";
import { ILogger } from "../interfaces";

const mockLogger: ILogger = {
  debug: vi.fn(),
  info: vi.fn(),
  warn: vi.fn(),
  error: vi.fn(),
};

describe("Fire Safety System Integration", () => {
  let eventBus: EventBus;
  let smokeAlarm: SmokeAlarm;
  let lambda: Lambda;
  let bucket: Bucket;
  let cloudWatch: CloudWatch;
  let doors: Door[];
  let lights: Light[];
  let sprinklers: Sprinkler[];

  beforeEach(() => {
    eventBus = new EventBus(mockLogger);
    smokeAlarm = new SmokeAlarm(eventBus, mockLogger);
    lambda = new Lambda(eventBus, mockLogger);
    bucket = new Bucket(eventBus, mockLogger);
    cloudWatch = new CloudWatch(eventBus, mockLogger);

    doors = [
      new Door(eventBus, "Front Door", mockLogger),
      new Door(eventBus, "Back Door", mockLogger),
    ];
    lights = [
      new Light(eventBus, "Hallway", mockLogger),
      new Light(eventBus, "Kitchen", mockLogger),
    ];
    sprinklers = [
      new Sprinkler(eventBus, "Upstairs", mockLogger),
      new Sprinkler(eventBus, "Downstairs", mockLogger),
    ];
  });

  it("should trigger all components when smoke is detected", () => {
    const bucketSpy = vi.spyOn(bucket, "update");
    const cloudWatchSpy = vi.spyOn(cloudWatch, "update");
    const doorSpies = doors.map((door) => vi.spyOn(door, "update"));
    const lightSpies = lights.map((light) => vi.spyOn(light, "update"));
    const sprinklerSpies = sprinklers.map((sprinkler) =>
      vi.spyOn(sprinkler, "update")
    );

    smokeAlarm.detectSmoke();

    expect(bucketSpy).toHaveBeenCalled();
    expect(cloudWatchSpy).toHaveBeenCalled();
    doorSpies.forEach((spy) => expect(spy).toHaveBeenCalled());
    lightSpies.forEach((spy) => expect(spy).toHaveBeenCalled());
    sprinklerSpies.forEach((spy) => expect(spy).toHaveBeenCalled());
  });

  it("should store event data in the bucket", () => {
    const storageSpy = vi.spyOn(bucket, "update");
    smokeAlarm.detectSmoke();
    expect(storageSpy).toHaveBeenCalled();
  });
});
