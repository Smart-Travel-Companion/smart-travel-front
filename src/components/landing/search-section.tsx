"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Search, MapPin, Sparkles } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/providers/auth-provider";

const popularDestinations = [
  "París",
  "Cancún",
  "Tokio",
  "Roma",
  "Buenos Aires",
  "Barcelona",
];

export function SearchSection() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const [query, setQuery] = React.useState("");

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();

    if (!isAuthenticated) {
      toast.error("Inicia sesión para buscar", {
        description: "Necesitas una cuenta para explorar destinos y recibir recomendaciones.",
        action: {
          label: "Iniciar sesión",
          onClick: () => router.push("/login"),
        },
      });
      return;
    }

    if (!query.trim()) {
      toast.error("Escribe un destino", {
        description: "Ingresa el nombre de una ciudad o lugar para buscar.",
      });
      return;
    }

    // TODO: Navegar a página de resultados cuando exista
    toast.success(`Buscando "${query}"...`, {
      description: "Pronto tendrás recomendaciones personalizadas.",
    });
  }

  function handlePopularClick(destination: string) {
    if (!isAuthenticated) {
      toast.error("Inicia sesión para buscar", {
        description: "Necesitas una cuenta para explorar destinos.",
        action: {
          label: "Iniciar sesión",
          onClick: () => router.push("/login"),
        },
      });
      return;
    }

    setQuery(destination);
    toast.success(`Buscando "${destination}"...`, {
      description: "Pronto tendrás recomendaciones personalizadas.",
    });
  }

  return (
    <section className="border-t border-border/40">
      <div className="container mx-auto px-4 py-20 md:px-6 md:py-28">
        <div className="mx-auto max-w-2xl text-center">
          {/* Icon */}
          <div className="mb-6 inline-flex items-center justify-center gap-2 rounded-full bg-primary/10 px-4 py-2">
            <Sparkles className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-primary">
              Impulsado por IA
            </span>
          </div>

          <h2 className="mb-4 text-3xl font-bold tracking-tight md:text-4xl">
            ¿A dónde quieres viajar?
          </h2>
          <p className="mb-8 text-muted-foreground">
            Encuentra las mejores experiencias de viaje en el destino de tus
            sueños.
          </p>

          {/* Search form */}
          <form onSubmit={handleSearch} className="mx-auto max-w-lg">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Busca tu destino..."
                  className="h-12 pl-10 text-base"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
              </div>
              <Button type="submit" size="lg" className="h-12 gap-2 px-6">
                <Search className="h-4 w-4" />
                Buscar
              </Button>
            </div>
          </form>

          {/* Popular destinations */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
            <span className="text-sm text-muted-foreground">Populares:</span>
            {popularDestinations.map((dest) => (
              <Badge
                key={dest}
                variant="outline"
                className="cursor-pointer transition-colors hover:bg-accent"
                onClick={() => handlePopularClick(dest)}
              >
                {dest}
              </Badge>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
