import { Bucket } from "../src/components/Bucket";
import { Lambda } from "../src/components/Lambda";
import { Cloudwatch } from "../src/components/Cloudwatch";
import { StoreDataCommand } from "../src/commands/StoreDataCommand";

describe("Smart Home System Integration", () => {
  it("should handle a complete flow of storing data with monitoring", async () => {
    const bucket = new Bucket();
    const lambda = new Lambda();
    const cloudwatch = new Cloudwatch();

    bucket.subscribe(cloudwatch);
    lambda.subscribe(cloudwatch);
    const command = new StoreDataCommand(bucket, "test-key", {
      value: "test-data",
    });
    await lambda.executeCommand(command);

    const storedData = await bucket.retrieve("test-key");
    expect(storedData).toEqual({ value: "test-data" });

    const metrics = cloudwatch.getMetrics();
    expect(metrics).toHaveLength(2);
  });

  it("should return undefined for missing data", async () => {
    const bucket = new Bucket();
    try {
      const retrievedData = await bucket.retrieve("non-existent-key");
      expect(retrievedData).toBeUndefined();
    } catch (error) {
      expect(error.message).toBe("No data found for key: non-existent-key");
    }
  });

  it("should handle Lambda execution failure gracefully", async () => {
    const bucket = new Bucket();
    const lambda = new Lambda();
    const failingCommand = new StoreDataCommand(bucket, "key", null);

    await expect(lambda.executeCommand(failingCommand)).rejects.toThrow(
      "Invalid data"
    );
  });

  it("should execute a command within an acceptable time frame", async () => {
    const bucket = new Bucket();
    const lambda = new Lambda();
    const command = new StoreDataCommand(bucket, "key", { value: "test" });

    const start = performance.now();
    await lambda.executeCommand(command);
    const end = performance.now();

    expect(end - start).toBeLessThan(200);
  });

  it("could be written by Rafael", async () => {});
  it("could be written by Mena", async () => {});
});
