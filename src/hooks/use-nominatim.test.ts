import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useNominatim } from "./use-nominatim";
import type { NominatimPlace } from "./use-nominatim";

const mockPlaces: NominatimPlace[] = [
  {
    place_id: 1,
    display_name: "Bogota, Colombia",
    lat: "4.6",
    lon: "-74.07",
    type: "city",
    address: { city: "Bogota", country: "Colombia", country_code: "co" },
  },
];

describe("useNominatim", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.mocked(globalThis.fetch).mockReset();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("clears suggestions for short queries", () => {
    const { result } = renderHook(() => useNominatim());

    act(() => {
      result.current.search("a");
    });

    expect(result.current.suggestions).toEqual([]);
    expect(result.current.isLoading).toBe(false);
  });

  it("searches after debounce delay", async () => {
    vi.mocked(globalThis.fetch).mockResolvedValueOnce({
      ok: true,
      json: async () => mockPlaces,
    } as Response);

    const { result } = renderHook(() => useNominatim());

    act(() => {
      result.current.search("Bogota");
    });

    expect(result.current.isLoading).toBe(true);

    // Advance past the 350ms debounce
    await act(async () => {
      vi.advanceTimersByTime(400);
    });

    expect(globalThis.fetch).toHaveBeenCalledTimes(1);
    expect(
      vi.mocked(globalThis.fetch).mock.calls[0][0]
    ).toContain("nominatim");
  });

  it("clear resets suggestions", () => {
    const { result } = renderHook(() => useNominatim());

    act(() => {
      result.current.clear();
    });

    expect(result.current.suggestions).toEqual([]);
  });
});
