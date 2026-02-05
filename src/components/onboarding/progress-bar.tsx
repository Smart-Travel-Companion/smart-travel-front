"use client";

import { cn } from "@/lib/utils";
import { Check } from "lucide-react";
import { onboardingSteps } from "@/constants/onboarding";

interface ProgressBarProps {
  currentStep: number;
}

export function ProgressBar({ currentStep }: ProgressBarProps) {
  return (
    <div className="w-full">
      {/* Desktop version */}
      <div className="hidden sm:block">
        <div className="flex items-center justify-between">
          {onboardingSteps.map((step, index) => {
            const isCompleted = index < currentStep;
            const isCurrent = index === currentStep;

            return (
              <div key={step.id} className="flex flex-1 items-center">
                {/* Step circle */}
                <div className="flex flex-col items-center">
                  <div
                    className={cn(
                      "flex h-10 w-10 items-center justify-center rounded-full border-2 text-sm font-medium transition-all duration-300",
                      isCompleted &&
                        "border-primary bg-primary text-primary-foreground",
                      isCurrent &&
                        "border-primary bg-background text-primary",
                      !isCompleted &&
                        !isCurrent &&
                        "border-muted-foreground/30 bg-background text-muted-foreground"
                    )}
                  >
                    {isCompleted ? (
                      <Check className="h-5 w-5" />
                    ) : (
                      step.id
                    )}
                  </div>
                  <span
                    className={cn(
                      "mt-2 text-xs font-medium transition-colors",
                      isCurrent ? "text-foreground" : "text-muted-foreground"
                    )}
                  >
                    {step.title}
                  </span>
                </div>

                {/* Connector line */}
                {index < onboardingSteps.length - 1 && (
                  <div className="mx-2 h-0.5 flex-1">
                    <div
                      className={cn(
                        "h-full transition-all duration-300",
                        index < currentStep
                          ? "bg-primary"
                          : "bg-muted-foreground/30"
                      )}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Mobile version - Simple progress bar */}
      <div className="sm:hidden">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium">
            Paso {currentStep + 1} de {onboardingSteps.length}
          </span>
          <span className="text-sm text-muted-foreground">
            {onboardingSteps[currentStep]?.title}
          </span>
        </div>
        <div className="h-2 w-full rounded-full bg-muted">
          <div
            className="h-full rounded-full bg-primary transition-all duration-300"
            style={{
              width: `${((currentStep + 1) / onboardingSteps.length) * 100}%`,
            }}
          />
        </div>
      </div>
    </div>
  );
}
