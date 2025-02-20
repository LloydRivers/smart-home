import { describe, expect, it, vi } from "vitest";
import { ConsoleLogger } from "./Logger";

describe("ConsoleLogger", () => {
  vi.spyOn(console, "debug").mockImplementation(() => {});
  vi.spyOn(console, "info").mockImplementation(() => {});
  vi.spyOn(console, "warn").mockImplementation(() => {});
  vi.spyOn(console, "error").mockImplementation(() => {});

  const logger = new ConsoleLogger();

  it("SHOULD log a debug message correctly", () => {
    logger.debug("Debug message");

    expect(console.debug).toHaveBeenCalledWith(
      expect.stringContaining("[DEBUG  ] Debug message")
    );
  });

  it("SHOULD log an info message correctly", () => {
    logger.info("Info message");

    expect(console.info).toHaveBeenCalledWith(
      expect.stringContaining("[INFO   ] Info message")
    );
  });

  it("SHOULD log a warning message correctly", () => {
    logger.warn("Warning message");

    expect(console.warn).toHaveBeenCalledWith(
      expect.stringContaining("[WARNING] Warning message")
    );
  });

  it("SHOULD log an error message correctly", () => {
    logger.error("Error message");

    expect(console.error).toHaveBeenCalledWith(
      expect.stringContaining("[ERROR  ] Error message")
    );
  });

  it("SHOULD log a message with additional data correctly", () => {
    const data = { key: "value" };
    logger.info("Info message with data", data);

    expect(console.info).toHaveBeenCalledWith(
      expect.stringContaining("[INFO   ] Info message with data")
    );
    expect(console.info).toHaveBeenCalledWith(
      expect.stringContaining(JSON.stringify(data, null, 2))
    );
  });
});
