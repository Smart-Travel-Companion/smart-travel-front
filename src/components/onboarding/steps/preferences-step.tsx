"use client";

import * as React from "react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import { StepContainer } from "../step-container";
import { fetchAvailablePreferences } from "@/lib/auth";
import { fallbackPreferences } from "@/constants/onboarding";

interface PreferencesStepProps {
  selected: string[];
  onToggle: (pref: string) => void;
  onNext: () => void;
  onBack: () => void;
}

export function PreferencesStep({
  selected,
  onToggle,
  onNext,
  onBack,
}: PreferencesStepProps) {
  const [options, setOptions] = React.useState<string[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    fetchAvailablePreferences()
      .then((prefs) => {
        setOptions(prefs.length > 0 ? prefs : fallbackPreferences);
      })
      .catch(() => {
        setOptions(fallbackPreferences);
      })
      .finally(() => setLoading(false));
  }, []);

  const isValid = selected.length > 0;

  return (
    <StepContainer
      title="¿Qué tipo de viajes te gustan?"
      description="Selecciona tus preferencias para recomendaciones personalizadas"
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
            {selected.length} seleccionada{selected.length !== 1 ? "s" : ""}
          </span>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <div className="flex flex-wrap justify-center gap-2">
            {options.map((pref) => {
              const isSelected = selected.includes(pref);

              return (
                <Badge
                  key={pref}
                  variant={isSelected ? "default" : "outline"}
                  className={cn(
                    "cursor-pointer px-4 py-2 text-sm capitalize transition-all hover:scale-105",
                    isSelected && "ring-2 ring-primary/20"
                  )}
                  onClick={() => onToggle(pref)}
                >
                  {pref}
                </Badge>
              );
            })}
          </div>
        )}

        <p className="text-center text-xs text-muted-foreground">
          Puedes seleccionar tantas como quieras
        </p>
      </div>
    </StepContainer>
  );
}
