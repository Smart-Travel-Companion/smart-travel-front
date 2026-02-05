"use client";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { interestOptions } from "@/constants/onboarding";
import { StepContainer } from "../step-container";

interface InterestsStepProps {
  selected: string[];
  onToggle: (interest: string) => void;
  onNext: () => void;
  onBack: () => void;
}

export function InterestsStep({
  selected,
  onToggle,
  onNext,
  onBack,
}: InterestsStepProps) {
  const isValid = selected.length > 0;

  return (
    <StepContainer
      title="¿Qué te interesa explorar?"
      description="Selecciona las actividades y temas que más te atraen"
      onNext={onNext}
      onBack={onBack}
      isNextDisabled={!isValid}
    >
      <div className="space-y-6">
        {/* Counter */}
        <div className="flex items-center justify-center">
          <span
            className={cn(
              "rounded-full px-4 py-1.5 text-sm font-medium transition-colors",
              selected.length > 0
                ? "bg-primary/10 text-primary"
                : "bg-muted text-muted-foreground"
            )}
          >
            {selected.length} seleccionado{selected.length !== 1 ? "s" : ""}
          </span>
        </div>

        {/* Interest badges */}
        <div className="flex flex-wrap justify-center gap-2">
          {interestOptions.map((interest) => {
            const isSelected = selected.includes(interest);

            return (
              <Badge
                key={interest}
                variant={isSelected ? "default" : "outline"}
                className={cn(
                  "cursor-pointer px-4 py-2 text-sm transition-all hover:scale-105",
                  isSelected && "ring-2 ring-primary/20"
                )}
                onClick={() => onToggle(interest)}
              >
                {interest}
              </Badge>
            );
          })}
        </div>

        {/* Helper text */}
        <p className="text-center text-xs text-muted-foreground">
          Puedes seleccionar tantos como quieras
        </p>
      </div>
    </StepContainer>
  );
}
