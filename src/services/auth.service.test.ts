import { describe, it, expect, vi, beforeEach } from "vitest";
import { login, register, fetchProfile } from "./auth.service";
import { buildAuthResponse, buildUser } from "@/test/factories";

vi.mock("./api-client", () => ({
  apiFetch: vi.fn(),
}));

import { apiFetch } from "./api-client";

describe("auth.service", () => {
  beforeEach(() => {
    vi.mocked(apiFetch).mockReset();
  });

  describe("login", () => {
    it("calls apiFetch with credentials and saves token", async () => {
      const mockResponse = buildAuthResponse();
      vi.mocked(apiFetch).mockResolvedValueOnce(mockResponse);

      const result = await login({
        email: "test@test.com",
        contraseña: "123456",
      });

      expect(apiFetch).toHaveBeenCalledWith("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({
          email: "test@test.com",
          contraseña: "123456",
        }),
      });
      expect(result.token).toBe("fake-jwt-token-123");
      expect(localStorage.getItem("auth_token")).toBe("fake-jwt-token-123");
    });
  });

  describe("register", () => {
    it("calls apiFetch and saves token + user", async () => {
      vi.mocked(apiFetch).mockResolvedValueOnce(buildAuthResponse());

      const result = await register({
        nombre: "Test User",
        email: "test@test.com",
        contraseña: "123456Aa",
        contraseñaConfirm: "123456Aa",
      });

      expect(apiFetch).toHaveBeenCalledWith(
        "/api/auth/registrar",
        expect.objectContaining({ method: "POST" })
      );
      expect(result.token).toBe("fake-jwt-token-123");
    });
  });

  describe("fetchProfile", () => {
    it("fetches profile with auth and saves user", async () => {
      const user = buildUser();
      vi.mocked(apiFetch).mockResolvedValueOnce({ usuario: user });

      const result = await fetchProfile();

      expect(apiFetch).toHaveBeenCalledWith("/api/auth/perfil", {
        auth: true,
      });
      expect(result).toEqual(user);
    });
  });
});
