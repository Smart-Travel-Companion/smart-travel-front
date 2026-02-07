"use client";

import { useEffect, useState, useCallback, useRef, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import {
  Search,
  MapPin,
  ArrowLeft,
  Loader2,
  AlertCircle,
  Sparkles,
  ImageOff,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Header, Footer } from "@/components/layout";
import { AuthGuard } from "@/components/layout/auth-guard";
import { useNominatim, type NominatimPlace } from "@/hooks/use-nominatim";
import { getRecomendaciones, type Place } from "@/lib/auth";
import { SearchLoading } from "@/components/explore/search-loading";
import { PlaceDetail } from "@/components/explore/place-detail";

// Dynamic import for map (no SSR)
const ExploreMap = dynamic(
  () =>
    import("@/components/explore/explore-map").then((mod) => mod.ExploreMap),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-full items-center justify-center rounded-xl bg-muted">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          <p className="text-xs text-muted-foreground">Cargando mapa...</p>
        </div>
      </div>
    ),
  }
);

export default function ExplorePage() {
  return (
    <Suspense fallback={null}>
      <ExploreContent />
    </Suspense>
  );
}

function ExploreContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const cityParam = searchParams.get("city") || "";
  const latParam = searchParams.get("lat");
  const lonParam = searchParams.get("lon");

  // States
  const [query, setQuery] = useState(cityParam);
  const [places, setPlaces] = useState<Place[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [flyToTrigger, setFlyToTrigger] = useState(0);
  const [showDropdown, setShowDropdown] = useState(false);
  const {
    suggestions,
    isLoading: nominatimLoading,
    search: nominatimSearch,
    clear: nominatimClear,
  } = useNominatim();

  const detailRef = useRef<HTMLDivElement>(null);

  // Search function
  const performSearch = useCallback(
    async (city: string, lat?: string | null, lon?: string | null) => {
      if (!city.trim()) return;
      setIsSearching(true);
      setError(null);
      setHasSearched(true);
      setActiveIndex(null);

      try {
        let result;
        if (lat && lon) {
          result = await getRecomendaciones({
            coordinates: {
              latitude: parseFloat(lat),
              longitude: parseFloat(lon),
            },
            radiusKm: 5,
            language: "es",
          });
        } else {
          result = await getRecomendaciones({
            city,
            radiusKm: 5,
            language: "es",
          });
        }

        const resultPlaces = result.places || [];
        setPlaces(resultPlaces);

        // Auto-select first place
        if (resultPlaces.length > 0) {
          setActiveIndex(0);
          toast.success(
            `${resultPlaces.length} lugares encontrados en ${city}`
          );
        }
      } catch (err) {
        const message =
          err instanceof Error
            ? err.message
            : "Error al buscar recomendaciones";
        setError(message);
        toast.error("Error en la búsqueda", { description: message });
      } finally {
        setIsSearching(false);
      }
    },
    []
  );

  // Auto-search on mount
  useEffect(() => {
    if (cityParam) {
      performSearch(cityParam, latParam, lonParam);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleInputChange(value: string) {
    setQuery(value);
    nominatimSearch(value);
    setShowDropdown(true);
  }

  function handleSelectSuggestion(place: NominatimPlace) {
    const city =
      place.address.city ||
      place.address.town ||
      place.address.village ||
      place.display_name.split(",")[0];
    setQuery(city);
    setShowDropdown(false);
    nominatimClear();

    const params = new URLSearchParams({
      city,
      lat: place.lat,
      lon: place.lon,
    });
    window.history.replaceState(null, "", `/explore?${params.toString()}`);
    performSearch(city, place.lat, place.lon);
  }

  function handleSearchSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!query.trim()) return;
    setShowDropdown(false);
    nominatimClear();

    const params = new URLSearchParams({ city: query.trim() });
    window.history.replaceState(null, "", `/explore?${params.toString()}`);
    performSearch(query.trim());
  }

  function formatPlaceName(place: NominatimPlace) {
    const parts = place.display_name.split(",").map((s) => s.trim());
    return { main: parts[0], secondary: parts.slice(1, 3).join(", ") };
  }

  // Marker or pill click -> select place and scroll to detail
  function handleSelectPlace(index: number) {
    setActiveIndex(index);
    setFlyToTrigger((prev) => prev + 1);
    detailRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  const hasResults = !isSearching && places.length > 0;
  const selectedPlace = activeIndex !== null ? places[activeIndex] : null;

  return (
    <AuthGuard>
      <div className="flex min-h-screen flex-col">
        <Header />

        <main className="flex flex-1 flex-col">
          {/* Search Header */}
          <div className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur-md">
            <div className="container mx-auto max-w-7xl px-4 py-3 md:px-6">
              <div className="flex items-center gap-3">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9 shrink-0 cursor-pointer"
                  onClick={() => router.back()}
                >
                  <ArrowLeft className="h-4 w-4" />
                </Button>

                <form
                  onSubmit={handleSearchSubmit}
                  className="relative flex-1"
                >
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <input
                        type="text"
                        placeholder="Buscar ciudad o destino..."
                        className="flex h-10 w-full rounded-lg border border-input bg-background px-3 pl-10 pr-10 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:border-primary"
                        value={query}
                        onChange={(e) => handleInputChange(e.target.value)}
                        onFocus={() => {
                          if (suggestions.length > 0) setShowDropdown(true);
                        }}
                        autoComplete="off"
                      />
                      {nominatimLoading && (
                        <Loader2 className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-muted-foreground" />
                      )}
                    </div>
                    <Button
                      type="submit"
                      size="sm"
                      className="h-10 gap-2 px-4 cursor-pointer"
                      disabled={isSearching}
                    >
                      {isSearching ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Search className="h-4 w-4" />
                      )}
                      <span className="hidden sm:inline">Buscar</span>
                    </Button>
                  </div>

                  {/* Autocomplete dropdown */}
                  {showDropdown && suggestions.length > 0 && (
                    <div className="absolute left-0 right-0 z-50 mt-1 overflow-hidden rounded-xl border bg-popover shadow-xl">
                      <div className="max-h-60 overflow-y-auto">
                        {suggestions.map((place) => {
                          const { main, secondary } = formatPlaceName(place);
                          return (
                            <button
                              key={place.place_id}
                              type="button"
                              className="flex w-full items-start gap-3 px-3 py-2.5 text-left transition-colors hover:bg-accent/50 cursor-pointer"
                              onClick={() => handleSelectSuggestion(place)}
                            >
                              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
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
                    </div>
                  )}
                </form>

                {/* Results count badge */}
                {hasResults && (
                  <div className="hidden items-center gap-2 sm:flex">
                    <Badge variant="secondary" className="rounded-full">
                      {places.length} lugares
                    </Badge>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Loading */}
          {isSearching && (
            <div className="container mx-auto max-w-7xl flex-1 px-4 py-6 md:px-6">
              <SearchLoading />
            </div>
          )}

          {/* Error */}
          {!isSearching && error && (
            <div className="flex flex-1 items-center justify-center px-4">
              <div className="text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-destructive/10">
                  <AlertCircle className="h-8 w-8 text-destructive" />
                </div>
                <h3 className="mt-4 text-lg font-semibold">
                  Error en la búsqueda
                </h3>
                <p className="mt-2 max-w-md text-sm text-muted-foreground">
                  {error}
                </p>
                <Button
                  className="mt-6 gap-2 cursor-pointer"
                  onClick={() => performSearch(query, latParam, lonParam)}
                >
                  <Search className="h-4 w-4" />
                  Reintentar
                </Button>
              </div>
            </div>
          )}

          {/* Empty state */}
          {!isSearching && !hasSearched && !error && (
            <div className="flex flex-1 items-center justify-center px-4">
              <div className="text-center">
                <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-primary/10">
                  <Sparkles className="h-10 w-10 text-primary" />
                </div>
                <h3 className="mt-6 text-xl font-semibold">
                  Explora el mundo con IA
                </h3>
                <p className="mt-2 max-w-md text-sm text-muted-foreground">
                  Busca una ciudad o destino para recibir recomendaciones
                  personalizadas de lugares increíbles para visitar.
                </p>
                <div className="mt-6 flex flex-wrap justify-center gap-2">
                  {[
                    "Madrid",
                    "Bogotá",
                    "Buenos Aires",
                    "Ciudad de México",
                    "Lima",
                  ].map((city) => (
                    <Badge
                      key={city}
                      variant="outline"
                      className="cursor-pointer px-3 py-1.5 text-sm transition-colors hover:bg-accent"
                      onClick={() => {
                        setQuery(city);
                        const params = new URLSearchParams({ city });
                        window.history.replaceState(
                          null,
                          "",
                          `/explore?${params.toString()}`
                        );
                        performSearch(city);
                      }}
                    >
                      <MapPin className="mr-1.5 h-3 w-3" />
                      {city}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* No results */}
          {!isSearching && hasSearched && !error && places.length === 0 && (
            <div className="flex flex-1 items-center justify-center px-4">
              <div className="text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-muted">
                  <MapPin className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="mt-4 text-lg font-semibold">
                  No se encontraron lugares
                </h3>
                <p className="mt-2 max-w-md text-sm text-muted-foreground">
                  No encontramos recomendaciones para &quot;{cityParam}&quot;.
                  Intenta con otra ciudad o destino.
                </p>
              </div>
            </div>
          )}

          {/* === RESULTS === */}
          {hasResults && (
            <>
              {/* Results header */}
              <div className="border-b bg-muted/30">
                <div className="container mx-auto max-w-7xl px-4 py-3 md:px-6">
                  <h2 className="text-base font-bold sm:text-lg">
                    Lugares en{" "}
                    <span className="text-primary">{cityParam}</span>
                  </h2>
                  <p className="text-xs text-muted-foreground">
                    {places.length} recomendaciones por IA — Haz click en un
                    marcador para ver los detalles
                  </p>
                </div>
              </div>

              {/* MAP - Full width with padding */}
              <div className="relative z-0 container mx-auto max-w-7xl px-4 py-4 md:px-6">
                <div className="h-87.5 sm:h-105 md:h-120 overflow-hidden rounded-xl border">
                  <ExploreMap
                    places={places}
                    activeIndex={activeIndex}
                    onMarkerClick={handleSelectPlace}
                    flyToTrigger={flyToTrigger}
                  />
                </div>
              </div>

              {/* DETAIL PANEL */}
              <div ref={detailRef}>
                {selectedPlace && (
                  <PlaceDetail place={selectedPlace} index={activeIndex!} />
                )}
              </div>

              {/* Other places - product-style cards */}
              {places.length > 1 && (
                <div className="border-t bg-muted/20">
                  <div className="container mx-auto max-w-7xl px-4 py-6 md:px-6">
                    <h3 className="mb-4 text-base font-bold sm:text-lg">
                      Otros lugares para visitar
                    </h3>
                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                      {places.map((place, i) => {
                        if (i === activeIndex) return null;
                        return (
                          <button
                            key={place.name + i}
                            onClick={() => handleSelectPlace(i)}
                            className="group cursor-pointer overflow-hidden rounded-xl border bg-card text-left transition-all hover:shadow-lg hover:border-primary/30"
                          >
                            {/* Thumbnail */}
                            <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                              {place.image_url ? (
                                <img
                                  src={place.image_url}
                                  alt={place.name}
                                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                                  onError={(e) => {
                                    (e.target as HTMLImageElement).style.display = "none";
                                  }}
                                />
                              ) : (
                                <div className="flex h-full items-center justify-center">
                                  <ImageOff className="h-6 w-6 text-muted-foreground/30" />
                                </div>
                              )}
                              {/* Number badge */}
                              <div className="absolute left-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-blue-600 text-[11px] font-bold text-white shadow">
                                {i + 1}
                              </div>
                            </div>
                            {/* Info */}
                            <div className="p-2.5">
                              <p className="truncate text-sm font-semibold leading-tight">
                                {place.name}
                              </p>
                              <p className="mt-1 truncate text-xs text-muted-foreground">
                                {place.category.split(",")[0].trim()}
                              </p>
                              <p className="mt-0.5 text-xs text-muted-foreground/70">
                                {place.distance_km.toFixed(1)} km
                              </p>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* Attribution */}
              <div className="border-t py-4 text-center">
                <p className="text-xs text-muted-foreground/60">
                  Recomendaciones generadas por inteligencia artificial — Mapa
                  de OpenStreetMap
                </p>
              </div>
            </>
          )}
        </main>

        {!hasResults && <Footer />}
      </div>
    </AuthGuard>
  );
}
