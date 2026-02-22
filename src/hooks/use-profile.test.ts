import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act, waitFor } from "@testing-library/react";
import { useProfile } from "./use-profile";
import { buildUser } from "@/test/factories";

vi.mock("@/providers/auth-provider", () => ({
  useAuth: vi.fn(),
}));
vi.mock("@/services/user.service", () => ({
  updateUser: vi.fn(),
}));
vi.mock("sonner", () => ({
  toast: { success: vi.fn(), error: vi.fn() },
}));

import { useAuth } from "@/providers/auth-provider";
import { updateUser } from "@/services/user.service";

describe("useProfile", () => {
  const mockUser = buildUser();
  const mockRefreshUser = vi.fn();

  beforeEach(() => {
    vi.mocked(useAuth).mockReturnValue({
      user: mockUser,
      isAuthenticated: true,
      isLoading: false,
      refreshUser: mockRefreshUser,
      logout: vi.fn(),
    });
    vi.mocked(updateUser).mockReset();
    mockRefreshUser.mockReset();
  });

  it("initializes form data from user", () => {
    const { result } = renderHook(() => useProfile());
    expect(result.current.formData.nombre).toBe("Juan Perez");
    expect(result.current.formData.pais).toBe("Colombia");
    expect(result.current.formData.ciudad).toBe("Bogota");
  });

  it("handleCancel resets form data and exits editing", () => {
    const { result } = renderHook(() => useProfile());

    act(() => {
      result.current.setIsEditing(true);
      result.current.setFormData((prev) => ({ ...prev, nombre: "Changed" }));
    });
    expect(result.current.formData.nombre).toBe("Changed");

    act(() => {
      result.current.handleCancel();
    });
    expect(result.current.formData.nombre).toBe("Juan Perez");
    expect(result.current.isEditing).toBe(false);
  });

  it("handleSave calls updateUser and refreshes", async () => {
    vi.mocked(updateUser).mockResolvedValueOnce(mockUser);
    mockRefreshUser.mockResolvedValueOnce(undefined);

    const { result } = renderHook(() => useProfile());

    await act(async () => {
      await result.current.handleSave();
    });

    expect(updateUser).toHaveBeenCalledWith(mockUser._id, expect.any(Object));
    expect(mockRefreshUser).toHaveBeenCalled();
  });

  it("computes profile completion correctly", () => {
    const { result } = renderHook(() => useProfile());
    // mockUser has: nombre, pais, ciudad, telefono, bio, preferencias (all filled)
    expect(result.current.completedCount).toBe(6);
    expect(result.current.completionPercent).toBe(100);
  });
});
