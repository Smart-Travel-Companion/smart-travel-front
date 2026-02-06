"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MapPin, Phone, Globe } from "lucide-react";
import { StepContainer } from "../step-container";

interface PersonalInfoStepProps {
  pais: string;
  ciudad: string;
  telefono: string;
  onFieldChange: (field: "pais" | "ciudad" | "telefono", value: string) => void;
  onNext: () => void;
  onBack: () => void;
  isValid: boolean;
}

export function PersonalInfoStep({
  pais,
  ciudad,
  telefono,
  onFieldChange,
  onNext,
  onBack,
  isValid,
}: PersonalInfoStepProps) {
  return (
    <StepContainer
      title="Cuéntanos sobre ti"
      description="Esta información nos ayuda a personalizar tus recomendaciones"
      onNext={onNext}
      onBack={onBack}
      isNextDisabled={!isValid}
    >
      <div className="mx-auto max-w-md space-y-6">
        <div className="space-y-2">
          <Label htmlFor="pais" className="flex items-center gap-2">
            <Globe className="h-4 w-4 text-muted-foreground" />
            País
          </Label>
          <Input
            id="pais"
            placeholder="Ej: Perú"
            value={pais}
            onChange={(e) => onFieldChange("pais", e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="ciudad" className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            Ciudad
          </Label>
          <Input
            id="ciudad"
            placeholder="Ej: Lima"
            value={ciudad}
            onChange={(e) => onFieldChange("ciudad", e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="telefono" className="flex items-center gap-2">
            <Phone className="h-4 w-4 text-muted-foreground" />
            Teléfono
            <span className="text-xs text-muted-foreground">(opcional)</span>
          </Label>
          <Input
            id="telefono"
            type="tel"
            placeholder="Ej: +51 999 999 999"
            value={telefono}
            onChange={(e) => onFieldChange("telefono", e.target.value)}
          />
        </div>
      </div>
    </StepContainer>
  );
}
