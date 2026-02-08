"use client";

import { Compass, MapPin, Calendar, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

interface WelcomeStepProps {
  userName: string;
  onNext: () => void;
}

const benefits = [
  {
    icon: MapPin,
    text: "Descubre destinos personalizados según tus gustos",
  },
  {
    icon: Calendar,
    text: "Crea itinerarios optimizados con IA",
  },
  {
    icon: Sparkles,
    text: "Recibe recomendaciones inteligentes en tiempo real",
  },
];

export function WelcomeStep({ userName, onNext }: WelcomeStepProps) {
  return (
    <div className="flex flex-col items-center space-y-8 text-center">
      {/* Icon */}
      <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-primary/10">
        <Compass className="h-10 w-10 text-primary" />
      </div>

      {/* Heading */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          ¡Hola, {userName}!
        </h1>
        <p className="text-lg text-muted-foreground">
          Bienvenido a Smart Travel Companion
        </p>
      </div>

      {/* Description */}
      <p className="max-w-md text-muted-foreground">
        Vamos a personalizar tu experiencia de viaje. Solo te tomará un par de
        minutos configurar tus preferencias.
      </p>

      {/* Benefits */}
      <div className="w-full max-w-sm space-y-4">
        {benefits.map((benefit) => {
          const Icon = benefit.icon;
          return (
            <div
              key={benefit.text}
              className="flex items-center gap-4 rounded-lg border border-border/50 bg-muted/30 p-4 text-left"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                <Icon className="h-5 w-5 text-primary" />
              </div>
              <p className="text-sm">{benefit.text}</p>
            </div>
          );
        })}
      </div>

      {/* CTA */}
      <Button size="lg" onClick={onNext} className="mt-4 gap-2">
        <Sparkles className="h-4 w-4" />
        Comenzar
      </Button>
    </div>
  );
}
