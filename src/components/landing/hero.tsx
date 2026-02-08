import Link from "next/link";
import { ArrowRight, Play } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.1),rgba(255,255,255,0))] dark:bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.15),rgba(0,0,0,0))]" />

      <div className="container mx-auto px-4 py-20 md:px-6 md:py-32">
        <div className="mx-auto max-w-4xl text-center">
          {/* Badge */}
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border/60 bg-background/50 px-4 py-1.5 text-sm backdrop-blur-sm">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
            </span>
            <span className="text-muted-foreground">
              Planifica tu próxima aventura con IA
            </span>
          </div>

          {/* Heading */}
          <h1 className="mb-6 text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
            Tu viaje, optimizado{" "}
            <span className="bg-linear-to-r from-neutral-900 via-neutral-700 to-neutral-900 bg-clip-text text-transparent dark:from-neutral-100 dark:via-neutral-300 dark:to-neutral-100">
              por IA
            </span>
          </h1>

          {/* Subtitle */}
          <p className="mx-auto mb-10 max-w-2xl text-lg text-muted-foreground md:text-xl">
            Sin fragmentación, sin estrés. Centraliza toda la información
            turística y crea itinerarios personalizados con inteligencia
            artificial.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link href="/register">
              <Button size="lg" className="gap-2">
                Empieza tu travesía ahora
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Button variant="outline" size="lg" className="gap-2">
              <Play className="h-4 w-4" />
              Ver demo
            </Button>
          </div>

          {/* Stats */}
          <div className="mt-16 grid grid-cols-2 gap-8 border-t border-border/40 pt-10 md:grid-cols-4">
            {[
              { value: "10K+", label: "Viajeros activos" },
              { value: "50+", label: "Destinos" },
              { value: "98%", label: "Satisfacción" },
              { value: "24/7", label: "Soporte IA" },
            ].map((stat) => (
              <div key={stat.label} className="space-y-1">
                <p className="text-2xl font-bold md:text-3xl">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
