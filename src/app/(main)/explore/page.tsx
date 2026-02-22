"use client";

import { useEffect, useState, useCallback, useRef, useMemo, Suspense } from "react";
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
  Bookmark,
  BookmarkCheck,
  Filter,
  X,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Header, Footer } from "@/components/layout";
import { AuthGuard } from "@/components/layout/auth-guard";
import { useNominatim, type NominatimPlace } from "@/hooks/use-nominatim";
import {
  getRecomendaciones,
  updateTrip,
  getTripById,
  type Place,
} from "@/lib/auth";
import { SearchLoading } from "@/components/explore/search-loading";
import { PlaceDetail } from "@/components/explore/place-detail";
import Image from "next/image";

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
  const tripIdParam = searchParams.get("tripId");

  // States
  const [query, setQuery] = useState(cityParam);
  const [displayCity, setDisplayCity] = useState(cityParam);
  const [places, setPlaces] = useState<Place[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [flyToTrigger, setFlyToTrigger] = useState(0);
  const [showDropdown, setShowDropdown] = useState(false);

  // Category filter states
  const [selectedCategories, setSelectedCategories] = useState<Set<string>>(
    new Set()
  );

  // Save trip states
  const [viajeId, setViajeId] = useState<string | null>(null);
  const [isSaved, setIsSaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isViewingTrip, setIsViewingTrip] = useState(false);

  const {
    suggestions,
    isLoading: nominatimLoading,
    search: nominatimSearch,
    clear: nominatimClear,
  } = useNominatim();

  const detailRef = useRef<HTMLDivElement>(null);
  const hasInitiated = useRef(false);

  // Extract all unique categories from places
  const allCategories = useMemo(() => {
    const cats = new Set<string>();
    places.forEach((place) => {
      if (place.category) {
        place.category.split(",").forEach((c) => {
          const trimmed = c.trim();
          if (trimmed) cats.add(trimmed);
        });
      }
    });
    return Array.from(cats).sort();
  }, [places]);

  // Filter places by selected categories
  const filteredPlaces = useMemo(() => {
    if (selectedCategories.size === 0) return places;
    return places.filter((place) => {
      if (!place.category) return false;
      const placeCats = place.category.split(",").map((c) => c.trim());
      return placeCats.some((cat) => selectedCategories.has(cat));
    });
  }, [places, selectedCategories]);

  // Toggle category selection
  function toggleCategory(cat: string) {
    setSelectedCategories((prev) => {
      const next = new Set(prev);
      if (next.has(cat)) {
        next.delete(cat);
      } else {
        next.add(cat);
      }
      return next;
    });
    setActiveIndex(null);
  }

  function clearFilters() {
    setSelectedCategories(new Set());
    setActiveIndex(null);
  }

  // Load saved trip by ID (no AI call)
  const loadSavedTrip = useCallback(async (tripId: string) => {
    setIsSearching(true);
    setError(null);
    setHasSearched(true);
    setIsViewingTrip(true);

    try {
      const trip = await getTripById(tripId);
      const tripPlaces = Array.isArray(trip.places) ? trip.places : [];
      setPlaces(tripPlaces);
      setViajeId(trip._id);
      setIsSaved(trip.estado === "guardada");

      const city = trip.ubicacion?.city || "";
      setDisplayCity(city);
      setQuery(city);

      if (tripPlaces.length > 0) {
        setActiveIndex(0);
      }
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Error al cargar el viaje";
      setError(message);
      toast.error("Error", { description: message });
    } finally {
      setIsSearching(false);
    }
  }, []);

  // Search function (new AI call)
  const performSearch = useCallback(
    async (city: string, lat?: string | null, lon?: string | null) => {
      if (!city.trim()) return;
      setIsSearching(true);
      setError(null);
      setHasSearched(true);
      setActiveIndex(null);
      setSelectedCategories(new Set());
      setIsSaved(false);
      setViajeId(null);
      setIsViewingTrip(false);
      setDisplayCity(city);

      try {
        let result;
        if (lat && lon) {
          // Send city AND coordinates so backend saves the city name
          result = await getRecomendaciones({
            city,
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

        if (result.viajeId) {
          setViajeId(result.viajeId);
        }

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

  // Auto-load on mount: tripId takes priority, then city search
  // Ref guard prevents double execution in React Strict Mode
  useEffect(() => {
    if (hasInitiated.current) return;
    hasInitiated.current = true;

    if (tripIdParam) {
      loadSavedTrip(tripIdParam);
    } else if (cityParam) {
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

  function handleSelectPlace(index: number) {
    setActiveIndex(index);
    setFlyToTrigger((prev) => prev + 1);
    detailRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  async function handleSaveTrip() {
    if (!viajeId || isSaved) return;
    setIsSaving(true);
    try {
      await updateTrip(viajeId, { estado: "guardada" });
      setIsSaved(true);
      toast.success("Viaje guardado exitosamente", {
        description: "Puedes verlo en 'Mis Viajes'",
      });
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Error al guardar";
      toast.error("Error al guardar viaje", { description: msg });
    } finally {
      setIsSaving(false);
    }
  }

  const hasResults = !isSearching && places.length > 0;
  const selectedPlace =
    activeIndex !== null && activeIndex < filteredPlaces.length
      ? filteredPlaces[activeIndex]
      : null;

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
                      {filteredPlaces.length} lugares
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
                  No encontramos recomendaciones para &quot;{displayCity || cityParam}&quot;.
                  Intenta con otra ciudad o destino.
                </p>
              </div>
            </div>
          )}

          {/* === RESULTS === */}
          {hasResults && (
            <>
              {/* Results header + Save button */}
              <div className="border-b bg-muted/30">
                <div className="container mx-auto max-w-7xl px-4 py-3 md:px-6">
                  <div className="flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <h2 className="text-base font-bold sm:text-lg">
                        {displayCity ? (
                          <>
                            Lugares en{" "}
                            <span className="text-primary">{displayCity}</span>
                          </>
                        ) : (
                          "Lugares recomendados"
                        )}
                      </h2>
                      <p className="text-xs text-muted-foreground">
                        {filteredPlaces.length} recomendaciones
                        {isViewingTrip ? " (viaje guardado)" : " por IA"}
                        {selectedCategories.size > 0 &&
                          ` (filtrado de ${places.length})`}{" "}
                        — Haz click en un marcador para ver los detalles
                      </p>
                    </div>
                    {viajeId && (
                      <Button
                        variant={isSaved ? "secondary" : "default"}
                        size="sm"
                        className="shrink-0 gap-2 cursor-pointer"
                        onClick={handleSaveTrip}
                        disabled={isSaving || isSaved}
                      >
                        {isSaving ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : isSaved ? (
                          <BookmarkCheck className="h-4 w-4" />
                        ) : (
                          <Bookmark className="h-4 w-4" />
                        )}
                        <span className="hidden sm:inline">
                          {isSaved ? "Guardado" : "Guardar viaje"}
                        </span>
                      </Button>
                    )}
                  </div>
                </div>
              </div>

              {/* Category Filter Bar */}
              {allCategories.length > 0 && (
                <div className="border-b bg-background">
                  <div className="container mx-auto max-w-7xl px-4 py-2.5 md:px-6">
                    <div className="flex items-center gap-2">
                      <div className="flex shrink-0 items-center gap-1.5 text-xs font-medium text-muted-foreground">
                        <Filter className="h-3.5 w-3.5" />
                        <span className="hidden sm:inline">Filtrar:</span>
                      </div>
                      <div className="flex flex-1 flex-wrap gap-1.5 overflow-x-auto">
                        {allCategories.map((cat) => {
                          const isActive = selectedCategories.has(cat);
                          return (
                            <Badge
                              key={cat}
                              variant={isActive ? "default" : "outline"}
                              className={`cursor-pointer rounded-full text-xs transition-all ${
                                isActive
                                  ? "bg-primary text-primary-foreground hover:bg-primary/90"
                                  : "hover:bg-accent"
                              }`}
                              onClick={() => toggleCategory(cat)}
                            >
                              {cat}
                            </Badge>
                          );
                        })}
                      </div>
                      {selectedCategories.size > 0 && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 shrink-0 gap-1 px-2 text-xs cursor-pointer"
                          onClick={clearFilters}
                        >
                          <X className="h-3 w-3" />
                          Limpiar
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* No filtered results */}
              {filteredPlaces.length === 0 && selectedCategories.size > 0 && (
                <div className="container mx-auto max-w-7xl px-4 py-12 md:px-6">
                  <div className="text-center">
                    <Filter className="mx-auto h-10 w-10 text-muted-foreground/40" />
                    <p className="mt-3 text-sm font-medium">
                      No hay lugares con estas categorías
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      Prueba seleccionando otras categorías
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      className="mt-4 cursor-pointer"
                      onClick={clearFilters}
                    >
                      Ver todos los lugares
                    </Button>
                  </div>
                </div>
              )}

              {filteredPlaces.length > 0 && (
                <>
                  {/* MAP */}
                  <div className="relative z-0 container mx-auto max-w-7xl px-4 py-4 md:px-6">
                    <div className="h-87.5 sm:h-105 md:h-120 overflow-hidden rounded-xl border">
                      <ExploreMap
                        places={filteredPlaces}
                        activeIndex={activeIndex}
                        onMarkerClick={handleSelectPlace}
                        flyToTrigger={flyToTrigger}
                      />
                    </div>
                  </div>

                  {/* DETAIL PANEL */}
                  <div ref={detailRef}>
                    {selectedPlace && (
                      <PlaceDetail
                        place={selectedPlace}
                        index={activeIndex!}
                      />
                    )}
                  </div>

                  {/* Other places - product-style cards */}
                  {filteredPlaces.length > 1 && (
                    <div className="border-t bg-muted/20">
                      <div className="container mx-auto max-w-7xl px-4 py-6 md:px-6">
                        <h3 className="mb-4 text-base font-bold sm:text-lg">
                          Otros lugares para visitar
                        </h3>
                        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                          {filteredPlaces.map((place, i) => {
                            if (i === activeIndex) return null;
                            return (
                              <button
                                key={place.name + i}
                                onClick={() => handleSelectPlace(i)}
                                className="group cursor-pointer overflow-hidden rounded-xl border bg-card text-left transition-all hover:shadow-lg hover:border-primary/30"
                              >
                                {/* Thumbnail */}
                                <div className="relative aspect-4/3 overflow-hidden bg-muted">
                                  {place.image_url ? (
                                    <Image
                                      src={place.image_url}
                                      alt={place.name}
                                      fill
                                      sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 20vw"
                                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                                      onError={(e) => {
                                        (
                                          e.target as HTMLImageElement
                                        ).style.display = "none";
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
                                    {place.category
                                      ? place.category.split(",")[0].trim()
                                      : ""}
                                  </p>
                                  <p className="mt-0.5 text-xs text-muted-foreground/70">
                                    {place.distance_km?.toFixed(1) ?? "?"} km
                                  </p>
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  )}
                </>
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

        {!hasResults && !isSearching && <Footer />}
      </div>
    </AuthGuard>
  );
}
