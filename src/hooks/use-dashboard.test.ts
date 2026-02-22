import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { useDashboard } from "./use-dashboard";
import { buildViaje, buildViajesResponse } from "@/test/factories";

vi.mock("@/services/trips.service", () => ({
  getMyTrips: vi.fn(),
}));

import { getMyTrips } from "@/services/trips.service";

describe("useDashboard", () => {
  beforeEach(() => {
    vi.mocked(getMyTrips).mockReset();
  });

  it("loads trips and computes stats", async () => {
    const trips = [
      buildViaje({
        _id: "1",
        estado: "guardada",
        ubicacion: { city: "Bogota", radiusKm: 10 },
      }),
      buildViaje({
        _id: "2",
        estado: "generada",
        ubicacion: { city: "Lima", radiusKm: 10 },
      }),
    ];
    vi.mocked(getMyTrips).mockResolvedValueOnce(buildViajesResponse(trips));

    const { result } = renderHook(() => useDashboard());

    expect(result.current.isLoadingTrips).toBe(true);

    await waitFor(() => {
      expect(result.current.isLoadingTrips).toBe(false);
    });

    expect(result.current.stats.totalTrips).toBe(2);
    expect(result.current.stats.savedTrips).toBe(1);
    expect(result.current.stats.uniqueDestinations).toBe(2);
  });

  it("handles API errors gracefully", async () => {
    vi.mocked(getMyTrips).mockRejectedValueOnce(new Error("Network error"));

    const { result } = renderHook(() => useDashboard());

    await waitFor(() => {
      expect(result.current.isLoadingTrips).toBe(false);
    });

    expect(result.current.trips).toEqual([]);
    expect(result.current.stats.totalTrips).toBe(0);
  });

  it("returns recentTrips sorted by date", async () => {
    const trips = [
      buildViaje({ _id: "old", createdAt: "2025-01-01T00:00:00Z" }),
      buildViaje({ _id: "new", createdAt: "2025-06-01T00:00:00Z" }),
    ];
    vi.mocked(getMyTrips).mockResolvedValueOnce(buildViajesResponse(trips));

    const { result } = renderHook(() => useDashboard());

    await waitFor(() => {
      expect(result.current.isLoadingTrips).toBe(false);
    });

    expect(result.current.recentTrips[0]._id).toBe("new");
    expect(result.current.recentTrips[1]._id).toBe("old");
  });
});
