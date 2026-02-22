import { describe, it, expect, vi, beforeEach } from "vitest";
import { getRecomendaciones } from "./recommendations.service";
import { buildPlace } from "@/test/factories";

vi.mock("./api-client", () => ({
  apiFetch: vi.fn(),
}));

import { apiFetch } from "./api-client";

describe("recommendations.service", () => {
  beforeEach(() => {
    vi.mocked(apiFetch).mockReset();
  });

  it("sends POST with city params", async () => {
    const mockResponse = { places: [buildPlace()], viajeId: "v1" };
    vi.mocked(apiFetch).mockResolvedValueOnce(mockResponse);

    const result = await getRecomendaciones({
      city: "Bogota",
      radiusKm: 5,
      language: "es",
    });

    expect(apiFetch).toHaveBeenCalledWith("/api/recomendaciones", {
      method: "POST",
      auth: true,
      body: expect.stringContaining("Bogota"),
    });
    expect(result.places).toHaveLength(1);
    expect(result.viajeId).toBe("v1");
  });

  it("sends POST with coordinate params", async () => {
    vi.mocked(apiFetch).mockResolvedValueOnce({ places: [], viajeId: "v2" });

    await getRecomendaciones({
      city: "Lima",
      coordinates: { latitude: -12.04, longitude: -77.03 },
      radiusKm: 5,
    });

    expect(apiFetch).toHaveBeenCalledWith(
      "/api/recomendaciones",
      expect.objectContaining({
        method: "POST",
        auth: true,
      })
    );
  });
});
