import { vi } from "vitest";
import { Lambda, Bucket, Cloudwatch } from "../src/components";
import { FireSafety } from "../src/features/FireSafety";
import { ILogger } from "../src/interfaces/index";
import { ConsoleLogger } from "../src/utils/Logger";
import { EventDispatcher } from "../src/event-dispatchers/EventDispatcher";

// Entities
import {
  Sprinkler,
  Door,
  Light,
  MotionSensor,
  SmokeAlarm,
} from "../src/entities";

// Commands
import {
  ActivateSprinklersHandler,
  TurnOnLightsHandler,
  UnlockDoorsHandler,
  AlertEmergencyServicesHandler,
  InvokeLambdaHandler,
  LogToCloudwatchHandler,
  StoreDataInBucketHandler,
} from "../src/commands";

describe("Fire Safety System", () => {
  let smokeAlarm: SmokeAlarm;
  let eventDispatcher: EventDispatcher;
  let motionSensor: MotionSensor;
  let logSpy: ReturnType<typeof vi.spyOn>;
  let warnSpy: ReturnType<typeof vi.spyOn>;
  let notifySpy: ReturnType<typeof vi.spyOn>;

  const logger: ILogger = new ConsoleLogger();
  beforeEach(() => {
    smokeAlarm = new SmokeAlarm(logger);
    eventDispatcher = new EventDispatcher();
    motionSensor = new MotionSensor(logger, "Motion Sensor");
    logSpy = vi.spyOn(logger, "info");
    warnSpy = vi.spyOn(logger, "warn");
    notifySpy = vi.spyOn(smokeAlarm, "notify");
  });

  it("should activate entire system", () => {
    const cloudwatch = new Cloudwatch(logger, "Cloudwatch");
    const bucket = new Bucket("Bucket");
    const lambda = new Lambda(logger, "Lambda");
    new FireSafety(smokeAlarm, eventDispatcher);
    // Set occupants to 1
    motionSensor.setOccupants(1);

    // Create ALL entities
    const sprinklers = [
      new Sprinkler(smokeAlarm, eventDispatcher, "Upstairs"),
      new Sprinkler(smokeAlarm, eventDispatcher, "Downstairs"),
    ];

    const lights = [
      new Light(smokeAlarm, eventDispatcher, "Upstairs"),
      new Light(smokeAlarm, eventDispatcher, "Downstairs"),
    ];

    const doors = [
      new Door(smokeAlarm, eventDispatcher, logger, "Front Door"),
      new Door(smokeAlarm, eventDispatcher, logger, "Back Door"),
    ];

    const activateSprinklersHandler = new ActivateSprinklersHandler(
      sprinklers,
      motionSensor
    );

    const unlockDoorsHandler = new UnlockDoorsHandler(doors);

    const turnOnLightsHandler = new TurnOnLightsHandler(lights);

    const alertEmergencyServicesHandler = new AlertEmergencyServicesHandler(
      logger
    );

    const cloudwatchHandler = new LogToCloudwatchHandler(cloudwatch);
    const lambdaHandler = new InvokeLambdaHandler(lambda, bucket, logger);
    const storeDataInBucketHandler = new StoreDataInBucketHandler(bucket);

    // Dispatchers (including thwe Lambda)
    eventDispatcher.registerHandler(activateSprinklersHandler);
    eventDispatcher.registerHandler(turnOnLightsHandler);
    eventDispatcher.registerHandler(unlockDoorsHandler);
    eventDispatcher.registerHandler(alertEmergencyServicesHandler);
    eventDispatcher.registerHandler(storeDataInBucketHandler);
    eventDispatcher.registerHandler(cloudwatchHandler);
    eventDispatcher.registerHandler(lambdaHandler);

    smokeAlarm.detectSmoke();

    expect(warnSpy).toHaveBeenCalledWith(
      "Smoke detected! Triggering fire safety systems."
    );

    expect(notifySpy).toHaveBeenCalledWith({
      type: "SMOKE_DETECTED",
      timestamp: expect.any(Date),
      payload: { action: "detected" },
    });

    sprinklers.forEach((sprinkler) => {
      expect(sprinkler.getActive()).toBe(true);
    });

    lights.forEach((light) => {
      expect(light.getIsOn()).toBe(true);
    });

    doors.forEach((door) => {
      expect(door.getLocked()).toBe(false);
    });

    expect(logSpy).toHaveBeenCalledWith("Alerted emergency services.");
  });
});
