import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  getMyTrips,
  getTripsByStatus,
  updateTrip,
  getTripById,
  deleteTrip,
  getCommunityTrips,
} from "./trips.service";
import { saveToken } from "./token.service";
import { buildViaje, buildViajesResponse } from "@/test/factories";
import { AuthError } from "@/types";

vi.mock("./api-client", () => ({
  apiFetch: vi.fn(),
}));

import { apiFetch } from "./api-client";

describe("trips.service", () => {
  beforeEach(() => {
    vi.mocked(apiFetch).mockReset();
    vi.mocked(globalThis.fetch).mockReset();
  });

  describe("getMyTrips", () => {
    it("fetches trips with auth", async () => {
      const response = buildViajesResponse();
      vi.mocked(apiFetch).mockResolvedValueOnce(response);

      const result = await getMyTrips();

      expect(apiFetch).toHaveBeenCalledWith("/api/viajes", { auth: true });
      expect(result.viajes).toHaveLength(1);
    });
  });

  describe("getTripsByStatus", () => {
    it("fetches trips filtered by estado", async () => {
      vi.mocked(apiFetch).mockResolvedValueOnce(buildViajesResponse());

      await getTripsByStatus("guardada");

      expect(apiFetch).toHaveBeenCalledWith("/api/viajes/estado/guardada", {
        auth: true,
      });
    });
  });

  describe("updateTrip", () => {
    it("sends PUT with trip data", async () => {
      const trip = buildViaje({ estado: "guardada" });
      vi.mocked(apiFetch).mockResolvedValueOnce({ viaje: trip });

      const result = await updateTrip("trip-1", { estado: "guardada" });

      expect(apiFetch).toHaveBeenCalledWith("/api/viajes/trip-1", {
        method: "PUT",
        auth: true,
        body: JSON.stringify({ estado: "guardada" }),
      });
      expect(result.estado).toBe("guardada");
    });
  });

  describe("getTripById", () => {
    it("fetches a single trip by ID", async () => {
      const trip = buildViaje();
      vi.mocked(apiFetch).mockResolvedValueOnce(trip);

      const result = await getTripById("trip-1");

      expect(apiFetch).toHaveBeenCalledWith("/api/viajes/trip-1", {
        auth: true,
      });
      expect(result._id).toBe("trip-1");
    });
  });

  describe("deleteTrip", () => {
    it("sends DELETE request with auth token", async () => {
      saveToken("my-token");
      vi.mocked(globalThis.fetch).mockResolvedValueOnce({
        ok: true,
        status: 204,
      } as Response);

      await deleteTrip("trip-1");

      expect(globalThis.fetch).toHaveBeenCalledWith(
        "http://localhost:3001/api/viajes/trip-1",
        {
          method: "DELETE",
          headers: { Authorization: "Bearer my-token" },
        }
      );
    });

    it("throws AuthError when no token", async () => {
      await expect(deleteTrip("trip-1")).rejects.toThrow(AuthError);
    });
  });

  describe("getCommunityTrips", () => {
    it("fetches community trips by preference", async () => {
      vi.mocked(apiFetch).mockResolvedValueOnce(buildViajesResponse());

      await getCommunityTrips("playa");

      expect(apiFetch).toHaveBeenCalledWith("/api/viajes/preferencia/playa");
    });
  });
});
