"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useOnboarding } from "@/hooks/use-onboarding";
import { useAuth } from "@/providers/auth-provider";
import { updateUser, updatePreferences } from "@/lib/auth";
import { ProgressBar } from "./progress-bar";
import {
  WelcomeStep,
  PersonalInfoStep,
  PreferencesStep,
  SummaryStep,
} from "./steps";

interface OnboardingWizardProps {
  user: {
    name: string;
  };
}

export function OnboardingWizard({ user }: OnboardingWizardProps) {
  const router = useRouter();
  const { user: authUser, refreshUser } = useAuth();
  const [currentStep, setCurrentStep] = React.useState(0);
  const [isLoading, setIsLoading] = React.useState(false);

  const {
    data,
    setField,
    togglePreference,
    isValid,
  } = useOnboarding();

  const handleNext = React.useCallback(() => {
    if (currentStep < 3) {
      setCurrentStep((prev) => prev + 1);
    }
  }, [currentStep]);

  const handleBack = React.useCallback(() => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  }, [currentStep]);

  const handleComplete = React.useCallback(async () => {
    if (!authUser?._id) return;

    setIsLoading(true);

    try {
      // 1. Actualizar datos del perfil
      await updateUser(authUser._id, {
        pais: data.pais,
        ciudad: data.ciudad,
        ...(data.telefono && { telefono: data.telefono }),
      });

      // 2. Actualizar preferencias
      await updatePreferences(authUser._id, data.preferencias);

      // 3. Refrescar datos del usuario en el contexto
      await refreshUser();

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
  }, [authUser, data, refreshUser, router]);

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return <WelcomeStep userName={user.name} onNext={handleNext} />;
      case 1:
        return (
          <PersonalInfoStep
            pais={data.pais}
            ciudad={data.ciudad}
            telefono={data.telefono}
            onFieldChange={setField}
            onNext={handleNext}
            onBack={handleBack}
            isValid={isValid.personalInfo}
          />
        );
      case 2:
        return (
          <PreferencesStep
            selected={data.preferencias}
            onToggle={togglePreference}
            onNext={handleNext}
            onBack={handleBack}
          />
        );
      case 3:
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
