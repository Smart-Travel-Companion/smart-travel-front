"use client";

import { useEffect, useState } from "react";
import { Sparkles, Plane, Map, Globe, Compass } from "lucide-react";

const loadingMessages = [
  {
    icon: Sparkles,
    text: "Nuestra IA está analizando los mejores lugares...",
    sub: "Esto puede tomar unos segundos",
  },
  {
    icon: Plane,
    text: "Explorando destinos increíbles para ti...",
    sub: "Buscando experiencias únicas",
  },
  {
    icon: Map,
    text: "Mapeando los puntos de interés cercanos...",
    sub: "Calculando distancias y rutas",
  },
  {
    icon: Globe,
    text: "Consultando fuentes locales y globales...",
    sub: "Verificando horarios y disponibilidad",
  },
  {
    icon: Compass,
    text: "Preparando recomendaciones personalizadas...",
    sub: "¡Casi listo! Los mejores lugares te esperan",
  },
];

export function SearchLoading() {
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % loadingMessages.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const currentMessage = loadingMessages[messageIndex];
  const Icon = currentMessage.icon;

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center">
      {/* Animated icon */}
      <div className="relative mb-8">
        <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-primary/10">
          <Icon className="h-10 w-10 text-primary animate-pulse" />
        </div>
        {/* Orbiting dots */}
        <div className="absolute inset-0 animate-spin" style={{ animationDuration: "3s" }}>
          <div className="absolute -top-1 left-1/2 h-2.5 w-2.5 -translate-x-1/2 rounded-full bg-primary/40" />
        </div>
        <div className="absolute inset-0 animate-spin" style={{ animationDuration: "3s", animationDelay: "1s" }}>
          <div className="absolute -bottom-1 left-1/2 h-2 w-2 -translate-x-1/2 rounded-full bg-primary/25" />
        </div>
      </div>

      {/* Message */}
      <div className="text-center transition-all duration-500">
        <p className="text-lg font-semibold">{currentMessage.text}</p>
        <p className="mt-2 text-sm text-muted-foreground">
          {currentMessage.sub}
        </p>
      </div>

      {/* Progress dots */}
      <div className="mt-8 flex gap-2">
        {loadingMessages.map((_, i) => (
          <div
            key={i}
            className={`h-2 rounded-full transition-all duration-300 ${
              i === messageIndex
                ? "w-8 bg-primary"
                : i < messageIndex
                  ? "w-2 bg-primary/40"
                  : "w-2 bg-muted"
            }`}
          />
        ))}
      </div>

      {/* Skeleton cards behind */}
      <div className="mt-12 w-full max-w-4xl px-4">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="overflow-hidden rounded-xl border bg-card"
              style={{
                opacity: 0.4 - i * 0.05,
                animationDelay: `${i * 0.1}s`,
              }}
            >
              {/* Image skeleton */}
              <div className="h-40 animate-pulse bg-muted" />
              {/* Content skeleton */}
              <div className="space-y-3 p-4">
                <div className="h-4 w-3/4 animate-pulse rounded bg-muted" />
                <div className="h-3 w-1/2 animate-pulse rounded bg-muted" />
                <div className="space-y-2">
                  <div className="h-3 w-full animate-pulse rounded bg-muted" />
                  <div className="h-3 w-5/6 animate-pulse rounded bg-muted" />
                </div>
                <div className="flex gap-2 pt-1">
                  <div className="h-6 w-16 animate-pulse rounded-full bg-muted" />
                  <div className="h-6 w-20 animate-pulse rounded-full bg-muted" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
