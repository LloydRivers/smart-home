import { CloudWatch } from "../../src/cloud/CloudWatch";
import { IEvent, ILogger } from "../../src/interfaces";
import { vi } from "vitest";

describe("CloudWatch", () => {
  const createMockLogger = () => ({
    debug: vi.fn(),
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
  });

  const createTestEvent = (timestamp: Date): IEvent => ({
    timestamp,
    type: "TestEvent",
    payload: { foo: "bar" },
    token: "test-token",
  });

  let cloudWatch: CloudWatch;
  let mockLogger: ILogger;

  beforeEach(() => {
    mockLogger = createMockLogger();
    cloudWatch = new CloudWatch(mockLogger);
  });

  it("should return the correct subscriber name", () => {
    expect(cloudWatch.getName()).toBe("CloudWatch");
  });

  it("should log a single event correctly", () => {
    const testEvent = createTestEvent(new Date("2024-02-13T12:00:00Z"));

    cloudWatch.update(testEvent);

    expect(mockLogger.info).toHaveBeenCalledWith(
      "[CloudWatch] Logging event:",
      testEvent
    );

    const secondEvent = createTestEvent(new Date("2024-02-13T12:01:00Z"));
    cloudWatch.update(secondEvent);

    expect(mockLogger.info).toHaveBeenCalledTimes(2);
    expect(mockLogger.info).toHaveBeenNthCalledWith(
      1,
      "[CloudWatch] Logging event:",
      testEvent
    );
    expect(mockLogger.info).toHaveBeenNthCalledWith(
      2,
      "[CloudWatch] Logging event:",
      secondEvent
    );
  });

  it("should maintain correct event order for multiple updates", () => {
    const events = [
      createTestEvent(new Date("2024-02-13T12:00:00Z")),
      createTestEvent(new Date("2024-02-13T12:01:00Z")),
      createTestEvent(new Date("2024-02-13T12:02:00Z")),
    ];

    events.forEach((event) => cloudWatch.update(event));

    events.forEach((event, index) => {
      expect(mockLogger.info).toHaveBeenNthCalledWith(
        index + 1,
        "[CloudWatch] Logging event:",
        event
      );
    });

    expect(mockLogger.info).toHaveBeenCalledTimes(events.length);
  });

  it("should handle events with identical timestamps", () => {
    const timestamp = new Date("2024-02-13T12:00:00Z");
    const event1 = createTestEvent(timestamp);
    const event2 = createTestEvent(timestamp);

    cloudWatch.update(event1);
    cloudWatch.update(event2);

    expect(mockLogger.info).toHaveBeenCalledTimes(2);
    expect(mockLogger.info).toHaveBeenNthCalledWith(
      1,
      "[CloudWatch] Logging event:",
      event1
    );
    expect(mockLogger.info).toHaveBeenNthCalledWith(
      2,
      "[CloudWatch] Logging event:",
      event2
    );
  });
});
