import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, waitFor, act } from "@testing-library/react";
import { useMyTrips } from "./use-my-trips";
import { buildViaje, buildViajesResponse } from "@/test/factories";

vi.mock("@/services/trips.service", () => ({
  getMyTrips: vi.fn(),
  updateTrip: vi.fn(),
  deleteTrip: vi.fn(),
}));
vi.mock("sonner", () => ({
  toast: { success: vi.fn(), error: vi.fn(), info: vi.fn() },
}));

import { getMyTrips, deleteTrip } from "@/services/trips.service";

describe("useMyTrips", () => {
  beforeEach(() => {
    vi.mocked(getMyTrips).mockReset();
    vi.mocked(deleteTrip).mockReset();
  });

  it("loads trips on mount", async () => {
    const trips = [buildViaje({ _id: "1" }), buildViaje({ _id: "2" })];
    vi.mocked(getMyTrips).mockResolvedValueOnce(buildViajesResponse(trips));

    const { result } = renderHook(() => useMyTrips());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.trips).toHaveLength(2);
    expect(result.current.stats.total).toBe(2);
  });

  it("filters by estado", async () => {
    const trips = [
      buildViaje({ _id: "1", estado: "guardada" }),
      buildViaje({ _id: "2", estado: "generada" }),
    ];
    vi.mocked(getMyTrips).mockResolvedValueOnce(buildViajesResponse(trips));

    const { result } = renderHook(() => useMyTrips());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    act(() => {
      result.current.setActiveFilter("guardada");
    });

    expect(result.current.filteredAndSortedTrips).toHaveLength(1);
    expect(result.current.filteredAndSortedTrips[0]._id).toBe("1");
  });

  it("filters by search query", async () => {
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
    vi.mocked(getMyTrips).mockResolvedValueOnce(buildViajesResponse(trips));

    const { result } = renderHook(() => useMyTrips());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    act(() => {
      result.current.setSearchQuery("Lima");
    });

    expect(result.current.filteredAndSortedTrips).toHaveLength(1);
    expect(result.current.filteredAndSortedTrips[0]._id).toBe("2");
  });

  it("sorts by city", async () => {
    const trips = [
      buildViaje({
        _id: "z",
        ubicacion: { city: "Zurich", radiusKm: 10 },
      }),
      buildViaje({
        _id: "a",
        ubicacion: { city: "Amsterdam", radiusKm: 10 },
      }),
    ];
    vi.mocked(getMyTrips).mockResolvedValueOnce(buildViajesResponse(trips));

    const { result } = renderHook(() => useMyTrips());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    act(() => {
      result.current.setSortBy("city");
    });

    expect(result.current.filteredAndSortedTrips[0]._id).toBe("a");
  });

  it("handleDelete removes trip from list", async () => {
    const trips = [buildViaje({ _id: "1" }), buildViaje({ _id: "2" })];
    vi.mocked(getMyTrips).mockResolvedValueOnce(buildViajesResponse(trips));
    vi.mocked(deleteTrip).mockResolvedValueOnce(undefined);

    const { result } = renderHook(() => useMyTrips());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    await act(async () => {
      await result.current.handleDelete("1");
    });

    expect(result.current.trips).toHaveLength(1);
    expect(result.current.trips[0]._id).toBe("2");
  });
});
