import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  updateUser,
  updatePreferences,
  fetchAvailablePreferences,
} from "./user.service";
import { buildUser } from "@/test/factories";

vi.mock("./api-client", () => ({
  apiFetch: vi.fn(),
}));

import { apiFetch } from "./api-client";

describe("user.service", () => {
  beforeEach(() => {
    vi.mocked(apiFetch).mockReset();
  });

  describe("updateUser", () => {
    it("sends PUT with user data and saves to localStorage", async () => {
      const user = buildUser({ nombre: "Updated Name" });
      vi.mocked(apiFetch).mockResolvedValueOnce({ usuario: user });

      const result = await updateUser("user-1", { nombre: "Updated Name" });

      expect(apiFetch).toHaveBeenCalledWith("/api/users/user-1", {
        method: "PUT",
        auth: true,
        body: JSON.stringify({ nombre: "Updated Name" }),
      });
      expect(result.nombre).toBe("Updated Name");
    });
  });

  describe("updatePreferences", () => {
    it("sends PUT with preferences array", async () => {
      vi.mocked(apiFetch).mockResolvedValueOnce({
        preferencias: ["playa", "montaña"],
      });

      const result = await updatePreferences("user-1", ["playa", "montaña"]);

      expect(apiFetch).toHaveBeenCalledWith(
        "/api/users/user-1/preferencias",
        expect.objectContaining({
          method: "PUT",
          auth: true,
        })
      );
      expect(result).toEqual(["playa", "montaña"]);
    });
  });

  describe("fetchAvailablePreferences", () => {
    it("fetches available preferences list", async () => {
      vi.mocked(apiFetch).mockResolvedValueOnce({
        preferencias: ["playa", "cultura", "aventura"],
      });

      const result = await fetchAvailablePreferences();

      expect(apiFetch).toHaveBeenCalledWith("/api/preferencias");
      expect(result).toEqual(["playa", "cultura", "aventura"]);
    });
  });
});
