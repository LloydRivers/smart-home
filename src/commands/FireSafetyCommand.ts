import { Door } from "../entities/Door";
import { Light } from "../entities/Light";
import { MotionSensor } from "../entities/MotionSensor";
import { Sprinkler } from "../entities/Sprinkler";
import {
  ICloudwatch,
  IEvent,
  IEventHandler,
  ILambda,
  ILogger,
  IStorageOperations,
} from "../interfaces";
import { StoreDataCommand } from "./StoreDataCommand";

export class ActivateSprinklersHandler implements IEventHandler {
  constructor(
    private sprinklers: Sprinkler[],
    private occupancySensor: MotionSensor
  ) {}

  handleEvent(event: IEvent): void {
    if (
      event.type === "SMOKE_DETECTED" &&
      this.occupancySensor.getOccupants() > 0
    ) {
      this.sprinklers.forEach((sprinkler) => sprinkler.setActive(true));
    }
  }
}

export class UnlockDoorsHandler implements IEventHandler {
  constructor(private doors: Door[]) {}

  handleEvent(event: IEvent): void {
    if (event.type === "SMOKE_DETECTED") {
      this.doors.forEach((door) => door.setLocked(false));
    }
  }
}

export class TurnOnLightsHandler implements IEventHandler {
  constructor(private lights: Light[]) {}

  handleEvent(event: IEvent): void {
    if (event.type === "SMOKE_DETECTED") {
      this.lights.forEach((light) => light.setOn(true));
    }
  }
}

export class StoreDataInBucketHandler implements IEventHandler {
  constructor(private bucket: IStorageOperations) {}

  handleEvent(event: IEvent): void {
    if (event.type === "SMOKE_DETECTED") {
      this.bucket.store("smoke-detection", { timestamp: new Date() });
      console.log("Stored smoke detection data in Bucket.");
    }
  }
}

export class InvokeLambdaHandler implements IEventHandler {
  constructor(
    private lambda: ILambda,
    private bucket: IStorageOperations,
    private logger: ILogger
  ) {}

  handleEvent(event: IEvent): void {
    if (event.type === "SMOKE_DETECTED") {
      const data = { value: "smoke detected", timestamp: new Date() };

      const command = new StoreDataCommand(
        this.bucket,
        this.logger,
        "smoke-detection",
        data
      );

      this.lambda.executeCommand(command);

      console.log("Triggered Lambda function for smoke detection.");
    }
  }
}

export class LogToCloudwatchHandler implements IEventHandler {
  constructor(private cloudwatch: ICloudwatch) {}

  handleEvent(event: IEvent): void {
    if (event.type === "SMOKE_DETECTED") {
      this.cloudwatch.update(event);
      console.log("Logged smoke detection event to Cloudwatch.");
    }
  }
}
