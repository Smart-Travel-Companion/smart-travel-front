"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Search, MapPin, Sparkles, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/providers/auth-provider";
import { useNominatim, type NominatimPlace } from "@/hooks/use-nominatim";

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
  const [showDropdown, setShowDropdown] = React.useState(false);
  const { suggestions, isLoading, search, clear } = useNominatim();
  const containerRef = React.useRef<HTMLDivElement>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);

  // Close dropdown on outside click
  React.useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function handleInputChange(value: string) {
    setQuery(value);
    search(value);
    setShowDropdown(true);
  }

  function navigateToExplore(city: string, lat?: string, lon?: string) {
    if (!isAuthenticated) {
      toast.error("Inicia sesión para buscar", {
        description:
          "Necesitas una cuenta para explorar destinos y recibir recomendaciones.",
        action: {
          label: "Iniciar sesión",
          onClick: () => router.push("/login"),
        },
      });
      return;
    }

    const params = new URLSearchParams({ city });
    if (lat && lon) {
      params.set("lat", lat);
      params.set("lon", lon);
    }
    router.push(`/explore?${params.toString()}`);
  }

  function handleSelectSuggestion(place: NominatimPlace) {
    const city =
      place.address.city ||
      place.address.town ||
      place.address.village ||
      place.display_name.split(",")[0];
    setQuery(city);
    setShowDropdown(false);
    clear();
    navigateToExplore(city, place.lat, place.lon);
  }

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (!query.trim()) {
      toast.error("Escribe un destino", {
        description: "Ingresa el nombre de una ciudad o lugar para buscar.",
      });
      return;
    }
    setShowDropdown(false);
    clear();
    navigateToExplore(query.trim());
  }

  function handlePopularClick(destination: string) {
    setQuery(destination);
    navigateToExplore(destination);
  }

  function formatPlaceName(place: NominatimPlace): {
    main: string;
    secondary: string;
  } {
    const parts = place.display_name.split(",").map((s) => s.trim());
    return {
      main: parts[0],
      secondary: parts.slice(1, 3).join(", "),
    };
  }

  return (
    <section className="border-t border-border/40">
      <div className="container mx-auto px-4 py-20 md:px-6 md:py-28">
        <div className="mx-auto max-w-2xl text-center">
          {/* Badge */}
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

          {/* Search form with autocomplete */}
          <form onSubmit={handleSearch} className="mx-auto max-w-lg">
            <div ref={containerRef} className="relative">
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <input
                    ref={inputRef}
                    type="text"
                    placeholder="Busca tu destino..."
                    className="flex h-12 w-full rounded-lg border border-input bg-background px-3 pl-10 text-base shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:border-primary"
                    value={query}
                    onChange={(e) => handleInputChange(e.target.value)}
                    onFocus={() => {
                      if (suggestions.length > 0) setShowDropdown(true);
                    }}
                    autoComplete="off"
                  />
                  {isLoading && (
                    <Loader2 className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-muted-foreground" />
                  )}
                </div>
                <Button type="submit" size="lg" className="h-12 gap-2 px-6 cursor-pointer">
                  <Search className="h-4 w-4" />
                  Buscar
                </Button>
              </div>

              {/* Autocomplete Dropdown */}
              {showDropdown && suggestions.length > 0 && (
                <div className="absolute left-0 right-0 z-50 mt-2 overflow-hidden rounded-xl border bg-popover shadow-xl animate-in fade-in-0 zoom-in-95">
                  <div className="px-3 py-2">
                    <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                      Sugerencias
                    </p>
                  </div>
                  <div className="max-h-72 overflow-y-auto">
                    {suggestions.map((place) => {
                      const { main, secondary } = formatPlaceName(place);
                      return (
                        <button
                          key={place.place_id}
                          type="button"
                          className="flex w-full items-start gap-3 px-3 py-3 text-left transition-colors hover:bg-accent/50 cursor-pointer"
                          onClick={() => handleSelectSuggestion(place)}
                        >
                          <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                            <MapPin className="h-4 w-4 text-primary" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-medium">
                              {main}
                            </p>
                            <p className="truncate text-xs text-muted-foreground">
                              {secondary}
                            </p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                  <div className="border-t px-3 py-2">
                    <p className="text-[10px] text-muted-foreground/60">
                      Datos de OpenStreetMap
                    </p>
                  </div>
                </div>
              )}
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
