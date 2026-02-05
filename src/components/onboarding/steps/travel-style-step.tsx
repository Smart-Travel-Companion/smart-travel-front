"use client";

import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";
import { travelStyleOptions } from "@/constants/onboarding";
import { StepContainer } from "../step-container";
import type { TravelStyle } from "@/types";

interface TravelStyleStepProps {
  selected: TravelStyle[];
  onToggle: (style: TravelStyle) => void;
  onNext: () => void;
  onBack: () => void;
}

export function TravelStyleStep({
  selected,
  onToggle,
  onNext,
  onBack,
}: TravelStyleStepProps) {
  const isValid = selected.length > 0;

  return (
    <StepContainer
      title="¿Cómo te gusta viajar?"
      description="Selecciona uno o más estilos de viaje que te representen"
      onNext={onNext}
      onBack={onBack}
      isNextDisabled={!isValid}
    >
      <div className="grid gap-4 sm:grid-cols-2">
        {travelStyleOptions.map((style) => {
          const Icon = style.icon;
          const isSelected = selected.includes(style.id);

          return (
            <Card
              key={style.id}
              className={cn(
                "cursor-pointer transition-all duration-200 hover:border-primary/50",
                isSelected
                  ? "border-primary bg-primary/5 ring-2 ring-primary/20"
                  : "hover:bg-accent/50"
              )}
              onClick={() => onToggle(style.id)}
            >
              <CardContent className="flex items-start gap-4 p-4">
                <div
                  className={cn(
                    "flex h-11 w-11 shrink-0 items-center justify-center rounded-lg transition-colors",
                    isSelected
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted"
                  )}
                >
                  <Icon className="h-5 w-5" />
                </div>
                <div className="flex-1 space-y-1">
                  <h3 className="font-medium">{style.label}</h3>
                  <p className="text-sm text-muted-foreground">
                    {style.description}
                  </p>
                </div>
                {isSelected && (
                  <Check className="h-5 w-5 shrink-0 text-primary" />
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {selected.length > 0 && (
        <p className="mt-4 text-center text-sm text-muted-foreground">
          {selected.length} estilo{selected.length !== 1 ? "s" : ""} seleccionado
          {selected.length !== 1 ? "s" : ""}
        </p>
      )}
    </StepContainer>
  );
}
