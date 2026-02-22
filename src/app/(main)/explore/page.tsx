"use client";

import { Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import Image from "next/image";
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

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Header, Footer } from "@/components/layout";
import { AuthGuard } from "@/components/layout/auth-guard";
import { useExplore } from "@/hooks/use-explore";
import { SearchLoading } from "@/components/explore/search-loading";
import { PlaceDetail } from "@/components/explore/place-detail";
import type { NominatimPlace } from "@/hooks/use-nominatim";

const ExploreMap = dynamic(
  () => import("@/components/explore/explore-map").then((mod) => mod.ExploreMap),
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

function formatPlaceName(place: NominatimPlace) {
  const parts = place.display_name.split(",").map((s) => s.trim());
  return { main: parts[0], secondary: parts.slice(1, 3).join(", ") };
}

function ExploreContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const { detailRef, ...explore } = useExplore({
    cityParam: searchParams.get("city") || "",
    latParam: searchParams.get("lat"),
    lonParam: searchParams.get("lon"),
    tripIdParam: searchParams.get("tripId"),
  });

  return (
    <AuthGuard>
      <div className="flex min-h-screen flex-col">
        <Header />

        <main className="flex flex-1 flex-col">
          {/* Search Header */}
          <div className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur-md">
            <div className="container mx-auto max-w-7xl px-4 py-3 md:px-6">
              <div className="flex items-center gap-3">
                <Button variant="ghost" size="icon" className="h-9 w-9 shrink-0 cursor-pointer" onClick={() => router.back()}>
                  <ArrowLeft className="h-4 w-4" />
                </Button>

                <form onSubmit={explore.handleSearchSubmit} className="relative flex-1">
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <input
                        type="text"
                        placeholder="Buscar ciudad o destino..."
                        className="flex h-10 w-full rounded-lg border border-input bg-background px-3 pl-10 pr-10 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:border-primary"
                        value={explore.query}
                        onChange={(e) => explore.handleInputChange(e.target.value)}
                        onFocus={() => { if (explore.suggestions.length > 0) explore.setQuery(explore.query); }}
                        autoComplete="off"
                      />
                      {explore.nominatimLoading && (
                        <Loader2 className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-muted-foreground" />
                      )}
                    </div>
                    <Button type="submit" size="sm" className="h-10 gap-2 px-4 cursor-pointer" disabled={explore.isSearching}>
                      {explore.isSearching ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
                      <span className="hidden sm:inline">Buscar</span>
                    </Button>
                  </div>

                  {/* Autocomplete dropdown */}
                  {explore.showDropdown && explore.suggestions.length > 0 && (
                    <div className="absolute left-0 right-0 z-50 mt-1 overflow-hidden rounded-xl border bg-popover shadow-xl">
                      <div className="max-h-60 overflow-y-auto">
                        {explore.suggestions.map((place) => {
                          const { main, secondary } = formatPlaceName(place);
                          return (
                            <button key={place.place_id} type="button" className="flex w-full items-start gap-3 px-3 py-2.5 text-left transition-colors hover:bg-accent/50 cursor-pointer" onClick={() => explore.handleSelectSuggestion(place)}>
                              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                              <div className="min-w-0 flex-1">
                                <p className="truncate text-sm font-medium">{main}</p>
                                <p className="truncate text-xs text-muted-foreground">{secondary}</p>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </form>

                {explore.hasResults && (
                  <div className="hidden items-center gap-2 sm:flex">
                    <Badge variant="secondary" className="rounded-full">
                      {explore.filteredPlaces.length} lugares
                    </Badge>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Loading */}
          {explore.isSearching && (
            <div className="container mx-auto max-w-7xl flex-1 px-4 py-6 md:px-6">
              <SearchLoading />
            </div>
          )}

          {/* Error */}
          {!explore.isSearching && explore.error && (
            <div className="flex flex-1 items-center justify-center px-4">
              <div className="text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-destructive/10">
                  <AlertCircle className="h-8 w-8 text-destructive" />
                </div>
                <h3 className="mt-4 text-lg font-semibold">Error en la búsqueda</h3>
                <p className="mt-2 max-w-md text-sm text-muted-foreground">{explore.error}</p>
                <Button className="mt-6 gap-2 cursor-pointer" onClick={() => explore.performSearch(explore.query, explore.latParam, explore.lonParam)}>
                  <Search className="h-4 w-4" />
                  Reintentar
                </Button>
              </div>
            </div>
          )}

          {/* Empty state */}
          {!explore.isSearching && !explore.hasSearched && !explore.error && (
            <div className="flex flex-1 items-center justify-center px-4">
              <div className="text-center">
                <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-primary/10">
                  <Sparkles className="h-10 w-10 text-primary" />
                </div>
                <h3 className="mt-6 text-xl font-semibold">Explora el mundo con IA</h3>
                <p className="mt-2 max-w-md text-sm text-muted-foreground">
                  Busca una ciudad o destino para recibir recomendaciones personalizadas de lugares increíbles para visitar.
                </p>
                <div className="mt-6 flex flex-wrap justify-center gap-2">
                  {["Madrid", "Bogotá", "Buenos Aires", "Ciudad de México", "Lima"].map((city) => (
                    <Badge
                      key={city}
                      variant="outline"
                      className="cursor-pointer px-3 py-1.5 text-sm transition-colors hover:bg-accent"
                      onClick={() => {
                        explore.setQuery(city);
                        const params = new URLSearchParams({ city });
                        window.history.replaceState(null, "", `/explore?${params.toString()}`);
                        explore.performSearch(city);
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
          {!explore.isSearching && explore.hasSearched && !explore.error && explore.places.length === 0 && (
            <div className="flex flex-1 items-center justify-center px-4">
              <div className="text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-muted">
                  <MapPin className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="mt-4 text-lg font-semibold">No se encontraron lugares</h3>
                <p className="mt-2 max-w-md text-sm text-muted-foreground">
                  No encontramos recomendaciones para &quot;{explore.displayCity || explore.cityParam}&quot;. Intenta con otra ciudad o destino.
                </p>
              </div>
            </div>
          )}

          {/* === RESULTS === */}
          {explore.hasResults && (
            <>
              {/* Results header + Save button */}
              <div className="border-b bg-muted/30">
                <div className="container mx-auto max-w-7xl px-4 py-3 md:px-6">
                  <div className="flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <h2 className="text-base font-bold sm:text-lg">
                        {explore.displayCity ? (
                          <>Lugares en{" "}<span className="text-primary">{explore.displayCity}</span></>
                        ) : (
                          "Lugares recomendados"
                        )}
                      </h2>
                      <p className="text-xs text-muted-foreground">
                        {explore.filteredPlaces.length} recomendaciones
                        {explore.isViewingTrip ? " (viaje guardado)" : " por IA"}
                        {explore.selectedCategories.size > 0 && ` (filtrado de ${explore.places.length})`}{" "}
                        — Haz click en un marcador para ver los detalles
                      </p>
                    </div>
                    {explore.viajeId && (
                      <Button variant={explore.isSaved ? "secondary" : "default"} size="sm" className="shrink-0 gap-2 cursor-pointer" onClick={explore.handleSaveTrip} disabled={explore.isSaving || explore.isSaved}>
                        {explore.isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : explore.isSaved ? <BookmarkCheck className="h-4 w-4" /> : <Bookmark className="h-4 w-4" />}
                        <span className="hidden sm:inline">{explore.isSaved ? "Guardado" : "Guardar viaje"}</span>
                      </Button>
                    )}
                  </div>
                </div>
              </div>

              {/* Category Filter Bar */}
              {explore.allCategories.length > 0 && (
                <div className="border-b bg-background">
                  <div className="container mx-auto max-w-7xl px-4 py-2.5 md:px-6">
                    <div className="flex items-center gap-2">
                      <div className="flex shrink-0 items-center gap-1.5 text-xs font-medium text-muted-foreground">
                        <Filter className="h-3.5 w-3.5" />
                        <span className="hidden sm:inline">Filtrar:</span>
                      </div>
                      <div className="flex flex-1 flex-wrap gap-1.5 overflow-x-auto">
                        {explore.allCategories.map((cat) => {
                          const isActive = explore.selectedCategories.has(cat);
                          return (
                            <Badge key={cat} variant={isActive ? "default" : "outline"} className={`cursor-pointer rounded-full text-xs transition-all ${isActive ? "bg-primary text-primary-foreground hover:bg-primary/90" : "hover:bg-accent"}`} onClick={() => explore.toggleCategory(cat)}>
                              {cat}
                            </Badge>
                          );
                        })}
                      </div>
                      {explore.selectedCategories.size > 0 && (
                        <Button variant="ghost" size="sm" className="h-7 shrink-0 gap-1 px-2 text-xs cursor-pointer" onClick={explore.clearFilters}>
                          <X className="h-3 w-3" />
                          Limpiar
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* No filtered results */}
              {explore.filteredPlaces.length === 0 && explore.selectedCategories.size > 0 && (
                <div className="container mx-auto max-w-7xl px-4 py-12 md:px-6">
                  <div className="text-center">
                    <Filter className="mx-auto h-10 w-10 text-muted-foreground/40" />
                    <p className="mt-3 text-sm font-medium">No hay lugares con estas categorías</p>
                    <p className="mt-1 text-xs text-muted-foreground">Prueba seleccionando otras categorías</p>
                    <Button variant="outline" size="sm" className="mt-4 cursor-pointer" onClick={explore.clearFilters}>
                      Ver todos los lugares
                    </Button>
                  </div>
                </div>
              )}

              {explore.filteredPlaces.length > 0 && (
                <>
                  {/* MAP */}
                  <div className="relative z-0 container mx-auto max-w-7xl px-4 py-4 md:px-6">
                    <div className="h-87.5 sm:h-105 md:h-120 overflow-hidden rounded-xl border">
                      <ExploreMap
                        places={explore.filteredPlaces}
                        activeIndex={explore.activeIndex}
                        onMarkerClick={explore.handleSelectPlace}
                        flyToTrigger={explore.flyToTrigger}
                      />
                    </div>
                  </div>

                  {/* DETAIL PANEL */}
                  <div ref={detailRef}>
                    {explore.selectedPlace && (
                      <PlaceDetail place={explore.selectedPlace} index={explore.activeIndex!} />
                    )}
                  </div>

                  {/* Other places grid */}
                  {explore.filteredPlaces.length > 1 && (
                    <div className="border-t bg-muted/20">
                      <div className="container mx-auto max-w-7xl px-4 py-6 md:px-6">
                        <h3 className="mb-4 text-base font-bold sm:text-lg">Otros lugares para visitar</h3>
                        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                          {explore.filteredPlaces.map((place, i) => {
                            if (i === explore.activeIndex) return null;
                            return (
                              <button key={place.name + i} onClick={() => explore.handleSelectPlace(i)} className="group cursor-pointer overflow-hidden rounded-xl border bg-card text-left transition-all hover:shadow-lg hover:border-primary/30">
                                <div className="relative aspect-4/3 overflow-hidden bg-muted">
                                  {place.image_url ? (
                                    <Image src={place.image_url} alt={place.name} fill sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 20vw" className="object-cover transition-transform duration-300 group-hover:scale-105" onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
                                  ) : (
                                    <div className="flex h-full items-center justify-center">
                                      <ImageOff className="h-6 w-6 text-muted-foreground/30" />
                                    </div>
                                  )}
                                  <div className="absolute left-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-blue-600 text-[11px] font-bold text-white shadow">
                                    {i + 1}
                                  </div>
                                </div>
                                <div className="p-2.5">
                                  <p className="truncate text-sm font-semibold leading-tight">{place.name}</p>
                                  <p className="mt-1 truncate text-xs text-muted-foreground">{place.category ? place.category.split(",")[0].trim() : ""}</p>
                                  <p className="mt-0.5 text-xs text-muted-foreground/70">{place.distance_km?.toFixed(1) ?? "?"} km</p>
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
                  Recomendaciones generadas por inteligencia artificial — Mapa de OpenStreetMap
                </p>
              </div>
            </>
          )}
        </main>

        {!explore.hasResults && !explore.isSearching && <Footer />}
      </div>
    </AuthGuard>
  );
}
