"use client";

import * as React from "react";
import type { TravelStyle, BudgetRange } from "@/types";

export interface OnboardingFormData {
  travelStyles: TravelStyle[];
  budget: BudgetRange | null;
  interests: string[];
}

export function useOnboarding(initialData?: Partial<OnboardingFormData>) {
  const [data, setData] = React.useState<OnboardingFormData>({
    travelStyles: [],
    budget: null,
    interests: [],
    ...initialData,
  });

  const toggleTravelStyle = React.useCallback((style: TravelStyle) => {
    setData((prev) => ({
      ...prev,
      travelStyles: prev.travelStyles.includes(style)
        ? prev.travelStyles.filter((s) => s !== style)
        : [...prev.travelStyles, style],
    }));
  }, []);

  const setBudget = React.useCallback((budget: BudgetRange) => {
    setData((prev) => ({ ...prev, budget }));
  }, []);

  const toggleInterest = React.useCallback((interest: string) => {
    setData((prev) => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter((i) => i !== interest)
        : [...prev.interests, interest],
    }));
  }, []);

  const isValid = React.useMemo(
    () => ({
      travelStyles: data.travelStyles.length > 0,
      budget: data.budget !== null,
      interests: data.interests.length > 0,
      all:
        data.travelStyles.length > 0 &&
        data.budget !== null &&
        data.interests.length > 0,
    }),
    [data]
  );

  return {
    data,
    setData,
    toggleTravelStyle,
    setBudget,
    toggleInterest,
    isValid,
  };
}
