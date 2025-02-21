import {
  isWithinAnyPeriod,
  TimeOfDayPeriod,
} from "@src/utils/isWithinAnyPeriod";
import { vi } from "vitest";

describe("isWithinAnyPeriod", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("SHOULD return true if now is within one of the specified periods", () => {
    const periods: TimeOfDayPeriod[] = [
      { start: { hour: 23, minute: 0 }, end: { hour: 2, minute: 0 } },
      { start: { hour: 9, minute: 0 }, end: { hour: 17, minute: 0 } },
    ];
    vi.setSystemTime(new Date("2025-02-18T23:30:00Z"));
    expect(isWithinAnyPeriod(periods)).toBe(true);
  });

  it("SHOULD return false if now is outside all of the specified periods", () => {
    const periods: TimeOfDayPeriod[] = [
      { start: { hour: 23, minute: 0 }, end: { hour: 2, minute: 0 } },
      { start: { hour: 9, minute: 0 }, end: { hour: 17, minute: 0 } },
    ];
    vi.setSystemTime(new Date("2025-02-18T03:00:00Z"));
    expect(isWithinAnyPeriod(periods)).toBe(false);
  });

  it("SHOULD return true if now is within a period that spans midnight", () => {
    const periods: TimeOfDayPeriod[] = [
      { start: { hour: 23, minute: 0 }, end: { hour: 2, minute: 0 } },
      { start: { hour: 6, minute: 0 }, end: { hour: 8, minute: 0 } },
    ];
    vi.setSystemTime(new Date("2025-02-18T01:00:00Z"));
    expect(isWithinAnyPeriod(periods)).toBe(true);
  });

  it("SHOULD return false if now is outside a period that spans midnight", () => {
    const periods: TimeOfDayPeriod[] = [
      { start: { hour: 23, minute: 0 }, end: { hour: 2, minute: 0 } },
      { start: { hour: 6, minute: 0 }, end: { hour: 8, minute: 0 } },
    ];
    vi.setSystemTime(new Date("2025-02-18T03:00:00Z"));
    expect(isWithinAnyPeriod(periods)).toBe(false);
  });
});
