"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Check, Sparkles } from "lucide-react";
import { travelStyleOptions, budgetOptions } from "@/constants/onboarding";
import { StepContainer } from "../step-container";
import type { OnboardingFormData } from "@/hooks/use-onboarding";

interface SummaryStepProps {
  data: OnboardingFormData;
  onBack: () => void;
  onComplete: () => void;
  isLoading: boolean;
}

export function SummaryStep({
  data,
  onBack,
  onComplete,
  isLoading,
}: SummaryStepProps) {
  const selectedStyles = travelStyleOptions.filter((s) =>
    data.travelStyles.includes(s.id)
  );
  const selectedBudget = budgetOptions.find((b) => b.id === data.budget);

  return (
    <StepContainer
      title="¡Todo listo!"
      description="Revisa tu perfil de viajero antes de continuar"
      onNext={onComplete}
      onBack={onBack}
      isLastStep
      isLoading={isLoading}
    >
      <Card className="mx-auto max-w-lg">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Sparkles className="h-5 w-5 text-primary" />
            Tu perfil de viajero
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Travel Styles */}
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-muted-foreground">
              Estilos de viaje
            </h4>
            <div className="space-y-2">
              {selectedStyles.map((style) => {
                const Icon = style.icon;
                return (
                  <div
                    key={style.id}
                    className="flex items-center gap-3 rounded-lg bg-muted/50 p-3"
                  >
                    <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary/10">
                      <Icon className="h-4 w-4 text-primary" />
                    </div>
                    <span className="text-sm font-medium">{style.label}</span>
                    <Check className="ml-auto h-4 w-4 text-primary" />
                  </div>
                );
              })}
            </div>
          </div>

          <Separator />

          {/* Budget */}
          {selectedBudget && (
            <div className="space-y-3">
              <h4 className="text-sm font-medium text-muted-foreground">
                Presupuesto
              </h4>
              <div className="flex items-center gap-3 rounded-lg bg-muted/50 p-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary/10">
                  <selectedBudget.icon className="h-4 w-4 text-primary" />
                </div>
                <div className="flex-1">
                  <span className="text-sm font-medium">
                    {selectedBudget.label}
                  </span>
                  <span className="ml-2 text-xs text-muted-foreground">
                    ({selectedBudget.priceRange})
                  </span>
                </div>
                <Check className="h-4 w-4 text-primary" />
              </div>
            </div>
          )}

          <Separator />

          {/* Interests */}
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-muted-foreground">
              Intereses ({data.interests.length})
            </h4>
            <div className="flex flex-wrap gap-2">
              {data.interests.map((interest) => (
                <Badge key={interest} variant="secondary" className="text-xs">
                  {interest}
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Motivational message */}
      <p className="mt-6 text-center text-sm text-muted-foreground">
        Podrás modificar estas preferencias en cualquier momento desde tu perfil
      </p>
    </StepContainer>
  );
}
