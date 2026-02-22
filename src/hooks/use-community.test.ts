import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, waitFor, act } from "@testing-library/react";
import { useCommunity } from "./use-community";
import { buildViaje, buildViajesResponse } from "@/test/factories";

vi.mock("@/services/trips.service", () => ({
  getCommunityTrips: vi.fn(),
}));
vi.mock("@/services/user.service", () => ({
  fetchAvailablePreferences: vi.fn().mockResolvedValue([]),
}));
vi.mock("sonner", () => ({
  toast: { success: vi.fn(), error: vi.fn(), info: vi.fn() },
}));

import { getCommunityTrips } from "@/services/trips.service";

describe("useCommunity", () => {
  beforeEach(() => {
    vi.mocked(getCommunityTrips).mockReset();
  });

  it("initializes with default categories and no results", () => {
    const { result } = renderHook(() => useCommunity());
    expect(result.current.trips).toEqual([]);
    expect(result.current.hasSearched).toBe(false);
    expect(result.current.availableCategories.length).toBeGreaterThan(0);
  });

  it("searchByCategory fetches and sets trips", async () => {
    const trips = [buildViaje({ _id: "c1" })];
    vi.mocked(getCommunityTrips).mockResolvedValueOnce(
      buildViajesResponse(trips)
    );

    const { result } = renderHook(() => useCommunity());

    await act(async () => {
      await result.current.searchByCategory("playa");
    });

    expect(getCommunityTrips).toHaveBeenCalledWith("playa");
    expect(result.current.trips).toHaveLength(1);
    expect(result.current.hasSearched).toBe(true);
    expect(result.current.selectedCategory).toBe("playa");
  });

  it("computes stats from loaded trips", async () => {
    const trips = [
      buildViaje({
        _id: "1",
        ubicacion: { city: "Bogota", radiusKm: 10 },
      }),
      buildViaje({
        _id: "2",
        ubicacion: { city: "Lima", radiusKm: 10 },
      }),
    ];
    vi.mocked(getCommunityTrips).mockResolvedValueOnce(
      buildViajesResponse(trips)
    );

    const { result } = renderHook(() => useCommunity());

    await act(async () => {
      await result.current.searchByCategory("cultura");
    });

    expect(result.current.stats.total).toBe(2);
    expect(result.current.stats.destinos).toBe(2);
  });
});
