import { EventBus } from "../../../src/core/EventBus";
import { SmokeAlarm } from "../../../src/alarms/SmokeAlarm";

// Devices under test
import { Light } from "../../../src/devices/Light";
import { Door } from "../../../src/devices/Door";
import { Sprinkler } from "../../../src/devices/Sprinkler";

// Cloud
import { Bucket } from "../../../src/cloud/Bucket";
import { CloudWatch } from "../../../src/cloud/CloudWatch";
import { Lambda } from "../../../src/cloud/Lambda";

// Utility
import { ConsoleLogger } from "../../../src/utils/Logger";
import { expect, vi } from "vitest";

import { ISubscriber } from "../../../src/interfaces";

// Create shared instances
const logger = new ConsoleLogger();
const eventBus = new EventBus(logger);
const smokeAlarm = new SmokeAlarm(eventBus, logger, "HOME_OWNER");

// Devices & services
const devices = {
  lights: [new Light("Hallway", logger), new Light("Kitchen", logger)],
  doors: [new Door("Back Door", logger), new Door("Garage Door", logger)],
  sprinklers: [
    new Sprinkler("Upstairs", logger),
    new Sprinkler("Downstairs", logger),
  ],
  cloudServices: {
    lambda: new Lambda(logger, eventBus),
    bucket: new Bucket(logger),
    cloudWatch: new CloudWatch(logger),
  },
};

// Setup mocks
const setupMocks = () => {
  vi.spyOn(logger, "info");
  vi.spyOn(logger, "error");
  vi.spyOn(logger, "warn");

  devices.lights.forEach((light) => vi.spyOn(light, "update"));
  devices.doors.forEach((door) => vi.spyOn(door, "update"));
  devices.sprinklers.forEach((sprinkler) => vi.spyOn(sprinkler, "update"));
  Object.values(devices.cloudServices).forEach((service) =>
    vi.spyOn(service, "update")
  );
};

describe("Smoke Alarm Tests", () => {
  // Reset before each test
  beforeEach(() => {
    eventBus.clearSubscriptions();
    vi.clearAllMocks();
    // Setup mocks and spies
    setupMocks();
  });
  it("expect foo to be bar", () => {
    expect("foo").toEqual("bar");
  });
  it("should trigger smoke alarm and notify subscribers", () => {
    // Subscribe listeners
    const smokeAlertListeners = [
      ...devices.lights,
      ...devices.doors,
      ...devices.sprinklers,
      devices.cloudServices.lambda,
      devices.cloudServices.cloudWatch,
    ];
    smokeAlertListeners.forEach((listener) => {
      eventBus.subscribe("SMOKE_DETECTED", listener);
    });
    eventBus.subscribe("STORE_EVENT_IN_BUCKET", devices.cloudServices.bucket);

    // Trigger the smoke alarm
    smokeAlarm.detectSmoke();

    // Check logger for smoke detection log
    expect(logger.error).toHaveBeenCalledWith(
      expect.stringContaining(
        "[SmokeAlarm] Smoke detected! Publishing event..."
      )
    );

    // Verify that all devices received the smoke detection event
    const checkUpdateCalled = (device: ISubscriber) => {
      expect(device.update).toHaveBeenCalledWith(
        expect.objectContaining({ type: "SMOKE_DETECTED" })
      );
    };

    // Check for lights, doors, and sprinklers
    devices.lights.forEach(checkUpdateCalled);
    devices.doors.forEach(checkUpdateCalled);
    devices.sprinklers.forEach(checkUpdateCalled);

    // Check for cloud services
    expect(devices.cloudServices.lambda.update).toHaveBeenCalledWith(
      expect.objectContaining({ type: "SMOKE_DETECTED" })
    );
    expect(devices.cloudServices.bucket.update).toHaveBeenCalledWith(
      expect.objectContaining({ type: "STORE_EVENT_IN_BUCKET" })
    );
    expect(devices.cloudServices.cloudWatch.update).toHaveBeenCalledWith(
      expect.objectContaining({ type: "SMOKE_DETECTED" })
    );
  });
});
