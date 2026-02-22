import { describe, it, expect, vi, beforeEach } from "vitest";
import { apiFetch } from "./api-client";
import { saveToken, getToken } from "./token.service";
import { AuthError } from "@/types";

function mockFetchResponse(body: unknown, status = 200) {
  vi.mocked(globalThis.fetch).mockResolvedValueOnce({
    ok: status >= 200 && status < 300,
    status,
    json: async () => body,
  } as Response);
}

function mockFetch204() {
  vi.mocked(globalThis.fetch).mockResolvedValueOnce({
    ok: true,
    status: 204,
    json: async () => undefined,
  } as Response);
}

describe("apiFetch", () => {
  beforeEach(() => {
    vi.mocked(globalThis.fetch).mockReset();
  });

  it("makes a GET request to the correct URL with headers", async () => {
    mockFetchResponse({ data: "ok" });
    const result = await apiFetch("/api/test");
    expect(globalThis.fetch).toHaveBeenCalledWith(
      "http://localhost:3001/api/test",
      expect.objectContaining({
        headers: expect.objectContaining({
          "Content-Type": "application/json",
        }),
      })
    );
    expect(result).toEqual({ data: "ok" });
  });

  it("attaches Authorization header when auth: true", async () => {
    saveToken("my-token");
    mockFetchResponse({ data: "ok" });
    await apiFetch("/api/test", { auth: true });
    expect(globalThis.fetch).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        headers: expect.objectContaining({
          Authorization: "Bearer my-token",
        }),
      })
    );
  });

  it("throws AuthError when auth: true but no token exists", async () => {
    await expect(apiFetch("/api/test", { auth: true })).rejects.toThrow(
      AuthError
    );
  });

  it("handles 204 no-content responses", async () => {
    mockFetch204();
    const result = await apiFetch("/api/test");
    expect(result).toBeUndefined();
  });

  it("throws AuthError on non-ok responses", async () => {
    mockFetchResponse({ mensaje: "No autorizado" }, 401);
    await expect(apiFetch("/api/test")).rejects.toThrow("No autorizado");
  });

  it("clears token on 401 response", async () => {
    saveToken("old-token");
    mockFetchResponse({ mensaje: "Expirado" }, 401);
    await expect(apiFetch("/api/test")).rejects.toThrow();
    expect(getToken()).toBeNull();
  });

  it("wraps network errors as AuthError", async () => {
    vi.mocked(globalThis.fetch).mockRejectedValueOnce(
      new TypeError("Failed to fetch")
    );
    await expect(apiFetch("/api/test")).rejects.toThrow(AuthError);
  });
});
