// For extra commits, you can cinfigure alias paths in tsconfig.json
// Then the imports would look like this:
// import { Bucket } from "components/Bucket";
import { Bucket } from "../src/components/Bucket";
import { Lambda } from "../src/components/Lambda";
import { Cloudwatch } from "../src/components/Cloudwatch";
import { StoreDataCommand } from "../src/commands/StoreDataCommand";

describe("Smart Home System Integration", () => {
  // Here you could add comments for Arrange, Act, and Assert. It is up to you both really,
  it("should handle a complete flow of storing data with monitoring", async () => {
    const bucket = new Bucket();
    const lambda = new Lambda();
    const cloudwatch = new Cloudwatch();

    // Subscribe Cloudwatch to both Bucket and Lambda events
    bucket.subscribe(cloudwatch);
    lambda.subscribe(cloudwatch);

    // Create and execute a command to store data
    const command = new StoreDataCommand(bucket, "test-key", {
      value: "test-data",
    });
    await lambda.executeCommand(command);

    // Verify the data was stored
    const storedData = await bucket.retrieve("test-key");
    expect(storedData).toEqual({ value: "test-data" });

    // Verify Cloudwatch received the events
    const metrics = cloudwatch.getMetrics();
    // Should have received STORAGE_UPDATE and COMMAND_EXECUTED events
    expect(metrics).toHaveLength(2);
  });
  it("could be written by rafael", async () => {});
  it("could be written by mena", async () => {});
});
