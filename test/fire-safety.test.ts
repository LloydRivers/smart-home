import { describe, it, expect, vi } from "vitest";
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
} from "../src/commands";

describe("FireSafety", () => {
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
    motionSensor = new MotionSensor(logger);

    logSpy = vi.spyOn(logger, "info");
    warnSpy = vi.spyOn(logger, "warn");
    notifySpy = vi.spyOn(smokeAlarm, "notify");
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should activate all sprinklers when smoke is detected", () => {
    motionSensor.setOccupants(1);

    const sprinklers = [
      new Sprinkler(smokeAlarm, eventDispatcher, "Upstairs"),
      new Sprinkler(smokeAlarm, eventDispatcher, "Downstairs"),
    ];

    const activateSprinklersHandler = new ActivateSprinklersHandler(
      sprinklers,
      motionSensor
    );
    eventDispatcher.registerHandler(activateSprinklersHandler);

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
  });

  it("should turn on all lights when smoke is detected", () => {
    motionSensor.setOccupants(1);

    const lights = [
      new Light(smokeAlarm, eventDispatcher, "Upstairs"),
      new Light(smokeAlarm, eventDispatcher, "Downstairs"),
    ];

    const turnOnLightsHandler = new TurnOnLightsHandler(lights);
    eventDispatcher.registerHandler(turnOnLightsHandler);

    smokeAlarm.detectSmoke();

    expect(warnSpy).toHaveBeenCalledWith(
      "Smoke detected! Triggering fire safety systems."
    );

    expect(notifySpy).toHaveBeenCalledWith({
      type: "SMOKE_DETECTED",
      timestamp: expect.any(Date),
      payload: { action: "detected" },
    });

    lights.forEach((light) => {
      expect(light.getIsOn()).toBe(true);
    });
  });

  it("should unlock all doors when smoke is detected", () => {
    const doors = [
      new Door(smokeAlarm, eventDispatcher, logger, "Front Door"),
      new Door(smokeAlarm, eventDispatcher, logger, "Back Door"),
    ];

    const unlockDoorsHandler = new UnlockDoorsHandler(doors);
    eventDispatcher.registerHandler(unlockDoorsHandler);

    smokeAlarm.detectSmoke();

    expect(warnSpy).toHaveBeenCalledWith(
      "Smoke detected! Triggering fire safety systems."
    );

    expect(notifySpy).toHaveBeenCalledWith({
      type: "SMOKE_DETECTED",
      timestamp: expect.any(Date),
      payload: { action: "detected" },
    });

    doors.forEach((door) => {
      expect(door.getLocked()).toBe(false);
    });
  });

  it("should alert emergency services when smoke is detected", () => {
    new FireSafety(smokeAlarm, eventDispatcher);

    const alertEmergencyServicesHandler = new AlertEmergencyServicesHandler(
      logger
    );

    eventDispatcher.registerHandler(alertEmergencyServicesHandler);

    smokeAlarm.detectSmoke();

    expect(warnSpy).toHaveBeenCalledWith(
      "Smoke detected! Triggering fire safety systems."
    );

    expect(notifySpy).toHaveBeenCalledWith({
      type: "SMOKE_DETECTED",
      timestamp: expect.any(Date),
      payload: { action: "detected" },
    });

    expect(logSpy).toHaveBeenCalledWith("Alerted emergency services.");
  });
});
