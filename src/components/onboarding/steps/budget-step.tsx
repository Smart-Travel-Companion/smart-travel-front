"use client";

import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";
import { budgetOptions } from "@/constants/onboarding";
import { StepContainer } from "../step-container";
import type { BudgetRange } from "@/types";

interface BudgetStepProps {
  selected: BudgetRange | null;
  onSelect: (budget: BudgetRange) => void;
  onNext: () => void;
  onBack: () => void;
}

export function BudgetStep({
  selected,
  onSelect,
  onNext,
  onBack,
}: BudgetStepProps) {
  const isValid = selected !== null;

  return (
    <StepContainer
      title="¿Cuál es tu presupuesto ideal?"
      description="Esto nos ayuda a recomendarte opciones acordes a tus expectativas"
      onNext={onNext}
      onBack={onBack}
      isNextDisabled={!isValid}
    >
      <div className="grid gap-4 sm:grid-cols-3">
        {budgetOptions.map((option) => {
          const Icon = option.icon;
          const isSelected = selected === option.id;

          return (
            <Card
              key={option.id}
              className={cn(
                "cursor-pointer transition-all duration-200 hover:border-primary/50",
                isSelected
                  ? "border-primary bg-primary/5 ring-2 ring-primary/20"
                  : "hover:bg-accent/50"
              )}
              onClick={() => onSelect(option.id)}
            >
              <CardContent className="flex flex-col items-center p-6 text-center">
                <div
                  className={cn(
                    "mb-4 flex h-14 w-14 items-center justify-center rounded-xl transition-colors",
                    isSelected
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted"
                  )}
                >
                  <Icon className="h-7 w-7" />
                </div>
                <h3 className="mb-1 font-semibold">{option.label}</h3>
                <p className="mb-3 text-xs text-muted-foreground">
                  {option.description}
                </p>
                <span
                  className={cn(
                    "rounded-full px-3 py-1 text-xs font-medium",
                    isSelected
                      ? "bg-primary/10 text-primary"
                      : "bg-muted text-muted-foreground"
                  )}
                >
                  {option.priceRange}
                </span>
                {isSelected && (
                  <div className="absolute right-3 top-3">
                    <Check className="h-5 w-5 text-primary" />
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </StepContainer>
  );
}
