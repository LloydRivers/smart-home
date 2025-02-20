import { Bucket } from "@src/cloud/Bucket";
import { IEvent, ILogger } from "@src/interfaces";
import { vi } from "vitest";

const createMockLogger = () => ({
  debug: vi.fn(),
  info: vi.fn(),
  warn: vi.fn(),
  error: vi.fn(),
});

describe("Bucket", () => {
  let bucket: Bucket;
  let mockLogger: ILogger;

  beforeEach(() => {
    mockLogger = createMockLogger();
    bucket = new Bucket(mockLogger);
  });
  const mockEvent: IEvent = {
    timestamp: new Date("2024-02-13T12:00:00Z"),
    type: "TestEvent",
    payload: { foo: "bar" },
    token: "test-token",
  };
  it("should store event data and log the operation", async () => {
    const expectedKey = mockEvent.timestamp.toISOString();

    bucket.update(mockEvent);

    const storedData = await bucket.retrieve(expectedKey);
    expect(storedData).toEqual(mockEvent);

    // Verify logging behavior
    expect(mockLogger.info).toHaveBeenCalledWith(
      "[Bucket] Storing event data",
      mockEvent
    );
    expect(mockLogger.info).toHaveBeenCalledWith(
      "[Bucket] Stored data under key: " + expectedKey
    );
  });

  it("should successfully store and retrieve data", async () => {
    // Arrange
    const testKey = "test-key";
    // Act
    await bucket.store(testKey, mockEvent);
    const retrievedData = await bucket.retrieve(testKey);

    // Assert
    expect(retrievedData).toEqual(mockEvent);
    expect(mockLogger.info).toHaveBeenCalledWith(
      "[Bucket] Stored data under key: " + testKey
    );
    expect(mockLogger.info).toHaveBeenCalledWith(
      "[Bucket] Retrieved data for key: " + testKey
    );
  });

  it("should handle retrieval of non-existent key", async () => {
    const nonExistentKey = "non-existent";

    const result = await bucket.retrieve(nonExistentKey);

    expect(result).toBeNull();
    expect(mockLogger.warn).toHaveBeenCalledWith(
      "[Bucket] No data found for key: " + nonExistentKey
    );
  });

  it("should successfully delete existing data", async () => {
    const testKey = "test-key";
    await bucket.store(testKey, mockEvent);

    await bucket.delete(testKey);

    const retrievedData = await bucket.retrieve(testKey);
    expect(retrievedData).toBeNull();
    expect(mockLogger.info).toHaveBeenCalledWith(
      "[Bucket] Deleted data for key: " + testKey
    );
  });
});
