"use client";

import * as React from "react";

export interface OnboardingFormData {
  pais: string;
  ciudad: string;
  telefono: string;
  preferencias: string[];
}

export function useOnboarding(initialData?: Partial<OnboardingFormData>) {
  const [data, setData] = React.useState<OnboardingFormData>({
    pais: "",
    ciudad: "",
    telefono: "",
    preferencias: [],
    ...initialData,
  });

  const setField = React.useCallback(
    (field: keyof OnboardingFormData, value: string) => {
      setData((prev) => ({ ...prev, [field]: value }));
    },
    []
  );

  const togglePreference = React.useCallback((pref: string) => {
    setData((prev) => ({
      ...prev,
      preferencias: prev.preferencias.includes(pref)
        ? prev.preferencias.filter((p) => p !== pref)
        : [...prev.preferencias, pref],
    }));
  }, []);

  const isValid = React.useMemo(
    () => ({
      personalInfo: data.pais.trim().length > 0 && data.ciudad.trim().length > 0,
      preferencias: data.preferencias.length > 0,
      all:
        data.pais.trim().length > 0 &&
        data.ciudad.trim().length > 0 &&
        data.preferencias.length > 0,
    }),
    [data]
  );

  return {
    data,
    setData,
    setField,
    togglePreference,
    isValid,
  };
}
