import { describe, expect, it, vi } from "vitest";
import { IEvent } from "../interfaces";
import { ConsoleLogger } from "../utils/Logger";
import { Bucket } from "./Bucket";

afterEach(() => {
  vi.clearAllMocks();
});

const logger = new ConsoleLogger();
const event: IEvent = {
  type: "EVENT_TYPE",
  timestamp: new Date(),
  payload: "payload",
  token: "token",
};
vi.spyOn(logger, "info").mockImplementation(vi.fn());
vi.spyOn(logger, "warn").mockImplementation(vi.fn());
vi.spyOn(logger, "error").mockImplementation(vi.fn());

describe("Bucket", () => {
  it("SHOULD return the correct name", () => {
    const bucket = new Bucket(logger);

    expect(bucket.getName()).toBe("Bucket");
  });

  it("SHOULD log storing event data and store the event on update", async () => {
    const bucket = new Bucket(logger);

    await bucket.update(event);

    expect(logger.info).toHaveBeenCalledWith(
      "[Bucket] Storing event data",
      event
    );
    expect(logger.info).toHaveBeenCalledWith(
      `[Bucket] Stored data under key: ${event.timestamp.toISOString()}`
    );
  });

  it("SHOULD store the event data correctly", async () => {
    const bucket = new Bucket(logger);
    const key = event.timestamp.toISOString();

    await bucket.store(key, event);

    expect(bucket["storage"].get(key)).toEqual(event);
    expect(logger.info).toHaveBeenCalledWith(
      `[Bucket] Stored data under key: ${key}`
    );
  });

  it("SHOULD log an error if storing fails", async () => {
    const bucket = new Bucket(logger);
    const error = new Error("Store error");

    vi.spyOn(bucket["storage"], "set").mockImplementationOnce(() => {
      throw error;
    });

    await expect(
      bucket.store(event.timestamp.toISOString(), event)
    ).rejects.toThrow("Failed to store data");
    expect(logger.error).toHaveBeenCalledWith(
      `[Bucket] Error storing data under key: ${event.timestamp.toISOString()}`,
      error
    );
  });

  it("SHOULD retrieve the stored event data correctly", async () => {
    const bucket = new Bucket(logger);
    const key = event.timestamp.toISOString();

    await bucket.store(key, event);
    const retrievedEvent = await bucket.retrieve(key);

    expect(retrievedEvent).toEqual(event);
    expect(logger.info).toHaveBeenCalledWith(
      `[Bucket] Retrieved data for key: ${key}`
    );
  });

  it("SHOULD log a warning if no data is found for retrieval", async () => {
    const bucket = new Bucket(logger);
    const key = "nonexistent-key";

    const retrievedEvent = await bucket.retrieve(key);

    expect(retrievedEvent).toBeNull();
    expect(logger.warn).toHaveBeenCalledWith(
      `[Bucket] No data found for key: ${key}`
    );
  });

  it("SHOULD delete the stored event data correctly", async () => {
    const bucket = new Bucket(logger);
    const key = event.timestamp.toISOString();

    await bucket.store(key, event);
    await bucket.delete(key);

    expect(bucket["storage"].has(key)).toBe(false);
    expect(logger.info).toHaveBeenCalledWith(
      `[Bucket] Deleted data for key: ${key}`
    );
  });

  it("SHOULD log a warning if no data is found for deletion", async () => {
    const bucket = new Bucket(logger);
    const key = "nonexistent-key";

    await bucket.delete(key);

    expect(logger.warn).toHaveBeenCalledWith(
      `[Bucket] No data found for key: ${key} to delete`
    );
  });
});
