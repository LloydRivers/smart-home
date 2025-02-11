import { EventBus } from "../core/EventBus";
import { IntruderAlarm } from "../alarms/IntruderAlarm";

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
const intruderAlert = new IntruderAlarm(eventBus, logger);

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
      eventBus.subscribe("INTRUDER_ALERT", light)
    );
    doors.forEach((door) => eventBus.subscribe("INTRUDER_ALERT", door));
    eventBus.subscribe("INTRUDER_ALERT", lambda);
    eventBus.subscribe("INTRUDER_ALERT", bucket);
    eventBus.subscribe("INTRUDER_ALERT", cloudWatch);

    // Trigger the intruder alert
    intruderAlert.detectIntruder();

    // Check that the logger has the expected log for the intruder alert
    expect(logger.info).toHaveBeenCalledWith(
      expect.stringContaining(
        "[IntruderAlert] Intruder detected! Publishing event..."
      )
    );

    // Verify that the update method was called on each Light instance.
    // Note all the other servces will be test the same unless you think of a diffferent way
    hallwayLights.forEach((light) => {
      expect(light.update).toHaveBeenCalledWith(
        expect.objectContaining({
          // Ensure that the correct event type is passed
          type: "INTRUDER_ALERT",
        })
      );
    });

    // Verify that the update method was called on each Door instance
    doors.forEach((door) => {
      expect(door.update).toHaveBeenCalledWith(
        expect.objectContaining({
          type: "INTRUDER_ALERT",
        })
      );
    });

    // Verify that the other devices and services (lambda, bucket, cloudWatch) also received the event
    expect(lambda.update).toHaveBeenCalledWith(
      expect.objectContaining({
        type: "INTRUDER_ALERT",
      })
    );
    expect(bucket.update).toHaveBeenCalledWith(
      expect.objectContaining({
        type: "INTRUDER_ALERT",
      })
    );
    expect(cloudWatch.update).toHaveBeenCalledWith(
      expect.objectContaining({
        type: "INTRUDER_ALERT",
      })
    );
  });
});
