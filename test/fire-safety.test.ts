import { describe, it, expect } from "vitest";
import { FireSafety } from "../src/features/FireSafety";
import { ILogger } from "../src/interfaces/index";
import { Sprinkler } from "../src/entities/Sprinkler";
import { MotionSensor } from "../src/entities/MotionSensor";
import { Light } from "../src/entities/Light";
import { Door } from "../src/entities/Door";
import { ConsoleLogger } from "../src/utils/Logger";
import { SmokeAlarm } from "../src/entities/SmokeAlarm";

describe("FireSafety", () => {
  it("should activate sprinklers and unlock doors when smoke is detected", async () => {
    const logger: ILogger = new ConsoleLogger();
    const smokeAlarm = new SmokeAlarm(logger);
    const sprinklers = [new Sprinkler(logger), new Sprinkler(logger)];
    const doors = [new Door(logger), new Door(logger)];
    const lights = [new Light(logger), new Light(logger)];
    const motionSensor = new MotionSensor(logger);

    // Create FireSafety instance and subscribe to smokeAlarm
    const fireSafety = new FireSafety(
      smokeAlarm,
      sprinklers,
      motionSensor,
      doors,
      lights
    );
    const mockType = {
      type: "SMOKE_DETECTED",
      timestamp: new Date(),
      payload: {},
    };
    motionSensor.setOccupants(2);
    fireSafety.update(mockType);

    expect(sprinklers.every((sprinkler) => sprinkler.getActive())).toBe(true);
    expect(doors.every((door) => door.getLocked())).toBe(false);
    expect(lights.every((light) => light.getOn())).toBe(true);
  });
});
