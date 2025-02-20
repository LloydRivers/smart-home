import { IntruderAlarm } from "../../../src/alarms/IntruderAlarm";
import { EventBus } from "../../../src/core/EventBus";

// Devices under test
import { Door } from "../../../src/devices/Door";
import { Light } from "../../../src/devices/Light";

// Cloud
import { Bucket } from "../../../src/cloud/Bucket";
import { CloudWatch } from "../../../src/cloud/CloudWatch";
import { Lambda } from "../../../src/cloud/Lambda";

// Utility
import { expect, vi } from "vitest";
import { ConsoleLogger } from "../../../src/utils/Logger";

// Create shared instances
const logger = new ConsoleLogger();
const eventBus = new EventBus(logger);
const intruderAlert = new IntruderAlarm(eventBus, logger, "HOME_OWNER");
// Devices & services
const devices = {
  lights: [new Light("Hallway", logger), new Light("Kitchen", logger)],
  doors: [new Door("Back Door", logger), new Door("Garage Door", logger)],
  cloudServices: {
    lambda: new Lambda(logger, eventBus),
    bucket: new Bucket(logger),
    cloudWatch: new CloudWatch(logger),
  },
};

// Setup mocks
const setupMocks = () => {
  vi.spyOn(logger, "info").mockImplementation(vi.fn());
  vi.spyOn(logger, "error").mockImplementation(vi.fn());
  vi.spyOn(logger, "warn").mockImplementation(vi.fn());

  devices.lights.forEach((light) => vi.spyOn(light, "update"));
  devices.doors.forEach((door) => vi.spyOn(door, "update"));
  Object.values(devices.cloudServices).forEach((service) =>
    vi.spyOn(service, "update")
  );
};

describe("Intruder Alarm Tests", () => {
  // Reset before each test
  beforeEach(() => {
    eventBus.clearSubscriptions();
    vi.clearAllMocks();
    setupMocks(); // Setup mocks and spies
  });

  it("should trigger intruder alert and notify subscribers", () => {
    // Subscribe listeners
    const intruderAlertListeners = [
      ...devices.lights,
      ...devices.doors,
      devices.cloudServices.lambda,
      devices.cloudServices.cloudWatch,
    ];
    intruderAlertListeners.forEach((listener) => {
      eventBus.subscribe("INTRUDER_ALERT", listener);
    });
    eventBus.subscribe("STORE_EVENT_IN_BUCKET", devices.cloudServices.bucket);

    // Trigger the intruder alert
    intruderAlert.detectIntruder();

    // Check logger for intruder alert message
    expect(logger.error).toHaveBeenCalledWith(
      expect.stringContaining(
        "[IntruderAlert] Intruder detected! Publishing event..."
      )
    );

    // Verify that all devices received the intruder alert
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const checkUpdateCalled = (device: any) => {
      expect(device.update).toHaveBeenCalledWith(
        expect.objectContaining({ type: "INTRUDER_ALERT" })
      );
    };

    // Check for lights and doors
    devices.lights.forEach(checkUpdateCalled);
    devices.doors.forEach(checkUpdateCalled);

    // Check for cloud services
    expect(devices.cloudServices.lambda.update).toHaveBeenCalledWith(
      expect.objectContaining({ type: "INTRUDER_ALERT" })
    );
    expect(devices.cloudServices.bucket.update).toHaveBeenCalledWith(
      expect.objectContaining({ type: "STORE_EVENT_IN_BUCKET" })
    );
    expect(devices.cloudServices.cloudWatch.update).toHaveBeenCalledWith(
      expect.objectContaining({ type: "INTRUDER_ALERT" })
    );
  });
});
