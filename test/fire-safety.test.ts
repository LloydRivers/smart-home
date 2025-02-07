import { describe, it, expect, vi } from "vitest";
import { FireSafety } from "../src/features/FireSafety";
import { ILogger } from "../src/interfaces/index";
import { Sprinkler } from "../src/entities/Sprinkler";
import { MotionSensor } from "../src/entities/MotionSensor";
import { Light } from "../src/entities/Light";
import { Door } from "../src/entities/Door";
import { ConsoleLogger } from "../src/utils/Logger";
import { SmokeAlarm } from "../src/entities/SmokeAlarm";
import { EventDispatcher } from "../src/event-dispatchers/EventDispatcher";
import {
  ActivateSprinklersHandler,
  InvokeLambdaHandler,
  LogToCloudwatchHandler,
  StoreDataInBucketHandler,
  TurnOnLightsHandler,
  UnlockDoorsHandler,
} from "../src/commands/FireSafetyCommand";
import { Bucket } from "../src/components/Bucket";
import { Lambda } from "../src/components/Lambda";
import { Cloudwatch } from "../src/components/Cloudwatch";

describe.only("FireSafety", () => {
  let logger: ILogger;
  let smokeAlarm: SmokeAlarm;
  let sprinklers: Sprinkler[];
  let doors: Door[];
  let lights: Light[];
  let motionSensor: MotionSensor;
  let bucket: Bucket;
  let lambda: Lambda;
  let cloudwatch: Cloudwatch;
  let eventDispatcher: EventDispatcher;
  beforeEach(() => {
    logger = new ConsoleLogger();
    smokeAlarm = new SmokeAlarm(logger);
    sprinklers = [new Sprinkler(logger), new Sprinkler(logger)];
    doors = [new Door(logger), new Door(logger)];
    lights = [new Light(logger), new Light(logger)];
    motionSensor = new MotionSensor(logger);
    bucket = new Bucket(logger);
    lambda = new Lambda(logger);
    cloudwatch = new Cloudwatch(logger);
    eventDispatcher = new EventDispatcher();
  });
  it("should activate sprinklers when smoke is detected", () => {
    eventDispatcher.registerHandler(
      new ActivateSprinklersHandler(sprinklers, motionSensor)
    );
    const fireSafety = new FireSafety(smokeAlarm, eventDispatcher);

    motionSensor.setOccupants(2);
    fireSafety.update({
      type: "SMOKE_DETECTED",
      timestamp: new Date(),
      payload: {},
    });

    expect(sprinklers.every((sprinkler) => sprinkler.getActive())).toBe(true);
  });
  it("should unlock doors when smoke is detected", () => {
    eventDispatcher.registerHandler(new UnlockDoorsHandler(doors));
    const fireSafety = new FireSafety(smokeAlarm, eventDispatcher);

    fireSafety.update({
      type: "SMOKE_DETECTED",
      timestamp: new Date(),
      payload: {},
    });

    expect(doors.every((door) => door.getLocked())).toBe(false);
  });
  it("should turn on lights when smoke is detected", () => {
    eventDispatcher.registerHandler(new TurnOnLightsHandler(lights));
    const fireSafety = new FireSafety(smokeAlarm, eventDispatcher);

    fireSafety.update({
      type: "SMOKE_DETECTED",
      timestamp: new Date(),
      payload: {},
    });

    expect(lights.every((light) => light.getOn())).toBe(true);
  });
  it("should log smoke detection to Cloudwatch", () => {
    const cloudwatchHandler = new LogToCloudwatchHandler(cloudwatch);
    eventDispatcher.registerHandler(cloudwatchHandler);
    const fireSafety = new FireSafety(smokeAlarm, eventDispatcher);

    const logSpy = vi.spyOn(cloudwatch, "processMetric");

    fireSafety.update({
      type: "SMOKE_DETECTED",
      timestamp: new Date(),
      payload: {},
    });

    expect(logSpy).toHaveBeenCalled();
  });
  it("should store data in the bucket when smoke is detected", () => {
    eventDispatcher.registerHandler(new StoreDataInBucketHandler(bucket));
    const fireSafety = new FireSafety(smokeAlarm, eventDispatcher);

    const storeSpy = vi.spyOn(bucket, "store");

    fireSafety.update({
      type: "SMOKE_DETECTED",
      timestamp: new Date(),
      payload: {},
    });

    expect(storeSpy).toHaveBeenCalled();
  });
  it("should invoke Lambda when smoke is detected", () => {
    eventDispatcher.registerHandler(
      new InvokeLambdaHandler(lambda, bucket, logger)
    );
    const fireSafety = new FireSafety(smokeAlarm, eventDispatcher);

    const lambdaSpy = vi.spyOn(lambda, "executeCommand");

    fireSafety.update({
      type: "SMOKE_DETECTED",
      timestamp: new Date(),
      payload: {},
    });

    expect(lambdaSpy).toHaveBeenCalled();
  });
});
