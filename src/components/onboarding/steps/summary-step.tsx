"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Sparkles, MapPin, Phone } from "lucide-react";
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
  return (
    <StepContainer
      title="¡Todo listo!"
      description="Revisa tu perfil antes de continuar"
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
          {/* Location */}
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-muted-foreground">
              Ubicación
            </h4>
            <div className="flex items-center gap-3 rounded-lg bg-muted/50 p-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary/10">
                <MapPin className="h-4 w-4 text-primary" />
              </div>
              <span className="text-sm font-medium">
                {data.ciudad}, {data.pais}
              </span>
            </div>
          </div>

          {/* Phone */}
          {data.telefono && (
            <>
              <Separator />
              <div className="space-y-3">
                <h4 className="text-sm font-medium text-muted-foreground">
                  Teléfono
                </h4>
                <div className="flex items-center gap-3 rounded-lg bg-muted/50 p-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary/10">
                    <Phone className="h-4 w-4 text-primary" />
                  </div>
                  <span className="text-sm font-medium">{data.telefono}</span>
                </div>
              </div>
            </>
          )}

          <Separator />

          {/* Preferences */}
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-muted-foreground">
              Preferencias ({data.preferencias.length})
            </h4>
            <div className="flex flex-wrap gap-2">
              {data.preferencias.map((pref) => (
                <Badge key={pref} variant="secondary" className="capitalize text-xs">
                  {pref}
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        Podrás modificar estos datos en cualquier momento desde tu perfil
      </p>
    </StepContainer>
  );
}
