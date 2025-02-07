import { Bucket } from "../src/components/Bucket";
import { Lambda } from "../src/components/Lambda";
import { Cloudwatch } from "../src/components/Cloudwatch";
import { StoreDataCommand } from "../src/commands/StoreDataCommand";
import { ConsoleLogger } from "../src/utils/Logger";
import { ILogger } from "../src/interfaces";

describe("Smart Home System Integration", () => {
  it("should handle a complete flow of storing data with monitoring", async () => {
    const logger: ILogger = new ConsoleLogger();
    const bucket = new Bucket(logger);
    const lambda = new Lambda(logger);
    const cloudwatch = new Cloudwatch(logger);

    bucket.subscribe(cloudwatch);
    lambda.subscribe(cloudwatch);

    const command = new StoreDataCommand(bucket, logger, "test-key", {
      value: "test-data",
    });

    await lambda.executeCommand(command);

    const storedData = await bucket.retrieve("test-key");
    expect(storedData).toEqual({ value: "test-data" });

    const metrics = cloudwatch.getMetrics();
    expect(metrics).toHaveLength(2);
  });

  it("should return undefined for missing data", async () => {
    const logger: ILogger = new ConsoleLogger();
    const bucket = new Bucket(logger);
    try {
      const retrievedData = await bucket.retrieve("non-existent-key");
      console.log(retrievedData);
      expect(retrievedData).toBeUndefined();
    } catch (error) {
      console.log(error);
      expect(error.message).toBe("No data found for key: non-existent-key");
    }
  });

  it("should handle Lambda execution failure gracefully", async () => {
    const logger: ILogger = new ConsoleLogger();
    const bucket = new Bucket(logger);
    const lambda = new Lambda(logger);
    const failingCommand = new StoreDataCommand(bucket, logger, "key", null);

    await expect(lambda.executeCommand(failingCommand)).rejects.toThrow(
      "Invalid data"
    );
  });

  it("should execute a command within an acceptable time frame", async () => {
    const logger: ILogger = new ConsoleLogger();
    const bucket = new Bucket(logger);
    const lambda = new Lambda(logger);
    const command = new StoreDataCommand(bucket, logger, "key", {
      value: "test",
    });

    const start = performance.now();
    await lambda.executeCommand(command);
    const end = performance.now();

    expect(end - start).toBeLessThan(200);
  });
});
