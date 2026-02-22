import { describe, it, expect } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useOnboarding } from "./use-onboarding";

describe("useOnboarding", () => {
  it("initializes with empty defaults", () => {
    const { result } = renderHook(() => useOnboarding());
    expect(result.current.data).toEqual({
      pais: "",
      ciudad: "",
      telefono: "",
      preferencias: [],
    });
  });

  it("accepts initial data", () => {
    const { result } = renderHook(() =>
      useOnboarding({ pais: "Colombia", ciudad: "Bogota" })
    );
    expect(result.current.data.pais).toBe("Colombia");
    expect(result.current.data.ciudad).toBe("Bogota");
  });

  it("setField updates a single field", () => {
    const { result } = renderHook(() => useOnboarding());
    act(() => {
      result.current.setField("pais", "Peru");
    });
    expect(result.current.data.pais).toBe("Peru");
  });

  it("togglePreference adds and removes preferences", () => {
    const { result } = renderHook(() => useOnboarding());
    act(() => {
      result.current.togglePreference("playa");
    });
    expect(result.current.data.preferencias).toEqual(["playa"]);

    act(() => {
      result.current.togglePreference("playa");
    });
    expect(result.current.data.preferencias).toEqual([]);
  });

  it("isValid reflects form completeness", () => {
    const { result } = renderHook(() => useOnboarding());
    expect(result.current.isValid.all).toBe(false);

    act(() => {
      result.current.setField("pais", "Colombia");
      result.current.setField("ciudad", "Bogota");
      result.current.togglePreference("playa");
    });
    expect(result.current.isValid.personalInfo).toBe(true);
    expect(result.current.isValid.preferencias).toBe(true);
    expect(result.current.isValid.all).toBe(true);
  });
});
