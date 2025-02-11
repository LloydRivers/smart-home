import { EventBus } from "../core/EventBus";
import { SmokeAlarm } from "../alarms/SmokeAlarm";

// Devices under test
import { Light } from "../devices/Light";
import { Door } from "../devices/Door";

// Cloud
import { Bucket } from "../cloud/Bucket";
import { CloudWatch } from "../cloud/CloudWatch";
import { Lambda } from "../cloud/Lambda";

// Utility
import { ConsoleLogger } from "../utils/Logger";
import { expect, vi } from "vitest";

// Mocking the logger
const logger = new ConsoleLogger();

// Creating an instance of the EventBus
const eventBus = new EventBus(logger);

// Creating instances of the alarm
const smokeAlarm = new SmokeAlarm(eventBus, logger);

// Creating instances of the cloud services
const lambda = new Lambda(logger);
const bucket = new Bucket(logger);
const cloudWatch = new CloudWatch(logger);

// Creating instances of the devices
const doors = [new Door("Back Door", logger), new Door("Garage Door", logger)];
const hallwayLights = [
  new Light("Hallway", logger),
  new Light("Kitchen", logger),
];

// Spy on info logger to track logs during tests
vi.spyOn(logger, "info");

// Spy on the update method of each Light and Door instance
hallwayLights.forEach((light) => {
  vi.spyOn(light, "update");
});
doors.forEach((door) => {
  vi.spyOn(door, "update");
});

// Spy on the update method for other services
vi.spyOn(lambda, "update");
vi.spyOn(bucket, "update");
vi.spyOn(cloudWatch, "update");

describe("Intruder Alarm Tests", () => {
  beforeEach(() => {
    eventBus.clearSubscriptions();
    vi.clearAllMocks();
  });

  it("should trigger intruder alert and notify subscribers", () => {
    hallwayLights.forEach((light) =>
      eventBus.subscribe("SMOKE_DETECTED", light)
    );
    doors.forEach((door) => eventBus.subscribe("SMOKE_DETECTED", door));
    eventBus.subscribe("SMOKE_DETECTED", lambda);
    eventBus.subscribe("SMOKE_DETECTED", bucket);
    eventBus.subscribe("SMOKE_DETECTED", cloudWatch);

    // Trigger the intruder alert
    smokeAlarm.detectSmoke();

    // Check that the logger has the expected log for the intruder alert
    expect(logger.info).toHaveBeenCalledWith(
      expect.stringContaining(
        "[SmokeAlarm] Smoke detected! Publishing event..."
      )
    );

    // Verify that the update method was called on each Light instance.
    // Note all the other servces will be test the same unless you think of a diffferent way
    hallwayLights.forEach((light) => {
      expect(light.update).toHaveBeenCalledWith(
        expect.objectContaining({
          // Ensure that the correct event type is passed
          type: "SMOKE_DETECTED",
        })
      );
    });

    // Verify that the update method was called on each Door instance
    doors.forEach((door) => {
      expect(door.update).toHaveBeenCalledWith(
        expect.objectContaining({
          type: "SMOKE_DETECTED",
        })
      );
    });

    // Verify that the other devices and services (lambda, bucket, cloudWatch) also received the event
    expect(lambda.update).toHaveBeenCalledWith(
      expect.objectContaining({
        type: "SMOKE_DETECTED",
      })
    );
    expect(bucket.update).toHaveBeenCalledWith(
      expect.objectContaining({
        type: "SMOKE_DETECTED",
      })
    );
    expect(cloudWatch.update).toHaveBeenCalledWith(
      expect.objectContaining({
        type: "SMOKE_DETECTED",
      })
    );
  });
});
