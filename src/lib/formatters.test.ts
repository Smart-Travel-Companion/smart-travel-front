import { describe, it, expect, vi, afterEach } from "vitest";
import {
  getInitials,
  formatDate,
  formatDateRelative,
  getGreeting,
  getDaysSinceDate,
} from "./formatters";

describe("getInitials", () => {
  it("extracts two initials from a full name", () => {
    expect(getInitials("Juan Perez")).toBe("JP");
  });

  it("returns single initial for a single name", () => {
    expect(getInitials("Juan")).toBe("J");
  });

  it("limits to 2 characters for three-word names", () => {
    expect(getInitials("Juan Carlos Perez")).toBe("JC");
  });

  it("handles lowercase input", () => {
    expect(getInitials("juan perez")).toBe("JP");
  });
});

describe("formatDate", () => {
  it("returns dash for undefined input", () => {
    expect(formatDate(undefined)).toBe("\u2014");
  });

  it("formats with medium variant by default", () => {
    const result = formatDate("2025-01-15T12:00:00Z");
    expect(result).toContain("15");
    expect(result).toContain("2025");
  });

  it("formats short variant without year", () => {
    const result = formatDate("2025-01-15T12:00:00Z", "short");
    expect(result).toContain("15");
  });

  it("formats long variant with full month name", () => {
    const result = formatDate("2025-01-15T12:00:00Z", "long");
    expect(result).toContain("enero");
  });
});

describe("formatDateRelative", () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it('returns "Hoy" for today', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2025-06-15T12:00:00Z"));
    expect(formatDateRelative("2025-06-15T10:00:00Z")).toBe("Hoy");
  });

  it('returns "Ayer" for yesterday', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2025-06-15T12:00:00Z"));
    expect(formatDateRelative("2025-06-14T10:00:00Z")).toBe("Ayer");
  });

  it('returns "Hace N dias" for less than a week ago', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2025-06-15T12:00:00Z"));
    expect(formatDateRelative("2025-06-12T10:00:00Z")).toBe("Hace 3 dias");
  });

  it("falls back to formatted date for older dates", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2025-06-15T12:00:00Z"));
    const result = formatDateRelative("2025-03-01T10:00:00Z");
    expect(result).toContain("2025");
  });
});

describe("getGreeting", () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it("returns morning greeting before noon", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2025-06-15T09:00:00"));
    expect(getGreeting()).toBe("Buenos dias");
  });

  it("returns afternoon greeting between 12 and 18", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2025-06-15T14:00:00"));
    expect(getGreeting()).toBe("Buenas tardes");
  });

  it("returns evening greeting after 18", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2025-06-15T20:00:00"));
    expect(getGreeting()).toBe("Buenas noches");
  });
});

describe("getDaysSinceDate", () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it("returns 0 for undefined", () => {
    expect(getDaysSinceDate()).toBe(0);
  });

  it("calculates days correctly", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2025-06-15T12:00:00Z"));
    expect(getDaysSinceDate("2025-06-10T12:00:00Z")).toBe(5);
  });
});
