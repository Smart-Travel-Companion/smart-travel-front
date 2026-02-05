"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useOnboarding } from "@/hooks/use-onboarding";
import { ProgressBar } from "./progress-bar";
import {
  WelcomeStep,
  TravelStyleStep,
  BudgetStep,
  InterestsStep,
  SummaryStep,
} from "./steps";

interface OnboardingWizardProps {
  user: {
    name: string;
  };
}

export function OnboardingWizard({ user }: OnboardingWizardProps) {
  const router = useRouter();
  const [currentStep, setCurrentStep] = React.useState(0);
  const [isLoading, setIsLoading] = React.useState(false);

  const {
    data,
    toggleTravelStyle,
    setBudget,
    toggleInterest,
  } = useOnboarding();

  const handleNext = React.useCallback(() => {
    if (currentStep < 4) {
      setCurrentStep((prev) => prev + 1);
    }
  }, [currentStep]);

  const handleBack = React.useCallback(() => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  }, [currentStep]);

  const handleComplete = React.useCallback(async () => {
    setIsLoading(true);

    try {
      // Simular guardado de preferencias
      await new Promise((resolve) => setTimeout(resolve, 1500));

      toast.success("¡Perfil configurado correctamente!", {
        description: "Tus preferencias han sido guardadas.",
      });

      router.push("/dashboard");
    } catch {
      toast.error("Error al guardar preferencias", {
        description: "Por favor, intenta de nuevo.",
      });
    } finally {
      setIsLoading(false);
    }
  }, [router]);

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return <WelcomeStep userName={user.name} onNext={handleNext} />;
      case 1:
        return (
          <TravelStyleStep
            selected={data.travelStyles}
            onToggle={toggleTravelStyle}
            onNext={handleNext}
            onBack={handleBack}
          />
        );
      case 2:
        return (
          <BudgetStep
            selected={data.budget}
            onSelect={setBudget}
            onNext={handleNext}
            onBack={handleBack}
          />
        );
      case 3:
        return (
          <InterestsStep
            selected={data.interests}
            onToggle={toggleInterest}
            onNext={handleNext}
            onBack={handleBack}
          />
        );
      case 4:
        return (
          <SummaryStep
            data={data}
            onBack={handleBack}
            onComplete={handleComplete}
            isLoading={isLoading}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="w-full space-y-8">
      {/* Progress bar - hide on welcome step */}
      {currentStep > 0 && (
        <div className="mb-8">
          <ProgressBar currentStep={currentStep} />
        </div>
      )}

      {/* Current step content */}
      <div className="mx-auto max-w-2xl">{renderStep()}</div>
    </div>
  );
}
