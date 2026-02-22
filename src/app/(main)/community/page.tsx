"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  MapPin,
  Calendar,
  Loader2,
  Search,
  Globe,
  ArrowLeft,
  ImageOff,
  Users,
  Navigation,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Header, Footer } from "@/components/layout";
import { AuthGuard } from "@/components/layout/auth-guard";
import {
  getCommunityTrips,
  fetchAvailablePreferences,
  type Viaje,
} from "@/lib/auth";

const popularCategories = [
  "playa",
  "cultura",
  "gastronomía",
  "aventura",
  "naturaleza",
  "historia",
  "arte",
  "montaña",
];

export default function CommunityPage() {
  const [trips, setTrips] = useState<Viaje[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [availableCategories, setAvailableCategories] =
    useState<string[]>(popularCategories);
  const [searchInput, setSearchInput] = useState("");

  useEffect(() => {
    fetchAvailablePreferences()
      .then((prefs) => {
        if (prefs.length > 0) setAvailableCategories(prefs);
      })
      .catch(() => {});
  }, []);

  const searchByCategory = useCallback(async (category: string) => {
    setIsLoading(true);
    setHasSearched(true);
    setSelectedCategory(category);

    try {
      const data = await getCommunityTrips(category);
      setTrips(data.viajes || []);
      if ((data.viajes || []).length === 0) {
        toast.info("No se encontraron viajes para esta categoría");
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Error al buscar";
      toast.error(msg);
      setTrips([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  function handleSearchSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!searchInput.trim()) return;
    searchByCategory(searchInput.trim().toLowerCase());
  }

  function formatDate(dateStr: string) {
    return new Date(dateStr).toLocaleDateString("es-ES", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  }

  function getTripImage(trip: Viaje): string | null {
    if (trip.places && Array.isArray(trip.places) && trip.places.length > 0) {
      return trip.places[0].image_url || null;
    }
    return null;
  }

  function getTripCity(trip: Viaje): string {
    return trip.ubicacion?.city || "";
  }

  function getPlacesCount(trip: Viaje): number {
    return Array.isArray(trip.places) ? trip.places.length : 0;
  }

  /** Build a proper explore URL using city + coordinates from the trip */
  function buildExploreUrl(trip: Viaje): string {
    const city = getTripCity(trip);
    const coords = trip.ubicacion?.coordinates;
    const params = new URLSearchParams();

    if (city) {
      params.set("city", city);
    }
    if (coords?.latitude && coords?.longitude) {
      params.set("lat", String(coords.latitude));
      params.set("lon", String(coords.longitude));
    }

    const qs = params.toString();
    return qs ? `/explore?${qs}` : "/explore";
  }

  // Stats
  const stats = {
    total: trips.length,
    destinos: new Set(trips.map((t) => getTripCity(t)).filter(Boolean)).size,
  };

  return (
    <AuthGuard>
      <div className="flex min-h-screen flex-col">
        <Header />

        <main className="flex-1">
          {/* Hero */}
          <div className="border-b bg-linear-to-b from-primary/5 to-transparent">
            <div className="container mx-auto max-w-6xl px-4 py-8 md:px-6">
              <div className="flex items-center gap-3 mb-6">
                <Link href="/dashboard">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-9 w-9 cursor-pointer"
                  >
                    <ArrowLeft className="h-4 w-4" />
                  </Button>
                </Link>
                <div>
                  <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
                    Viajes de la Comunidad
                  </h1>
                  <p className="text-sm text-muted-foreground">
                    Descubre itinerarios guardados por otros viajeros
                  </p>
                </div>
              </div>

              {/* Search */}
              <form onSubmit={handleSearchSubmit}>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <input
                      type="text"
                      placeholder="Buscar por preferencia (ej: playa, cultura, gastronomía...)"
                      className="flex h-11 w-full rounded-xl border border-input bg-background px-3 pl-10 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:border-primary"
                      value={searchInput}
                      onChange={(e) => setSearchInput(e.target.value)}
                    />
                  </div>
                  <Button
                    type="submit"
                    className="h-11 gap-2 px-5 cursor-pointer rounded-xl"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Search className="h-4 w-4" />
                    )}
                    <span className="hidden sm:inline">Buscar</span>
                  </Button>
                </div>
              </form>

              {/* Category chips */}
              <div className="mt-4 flex flex-wrap gap-2">
                {availableCategories.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    className={`inline-flex items-center rounded-full border px-3 py-1.5 text-xs font-medium capitalize transition-all cursor-pointer ${
                      selectedCategory === cat
                        ? "border-primary bg-primary text-primary-foreground shadow-sm"
                        : "border-border bg-background hover:bg-accent hover:border-accent-foreground/20"
                    }`}
                    onClick={() => {
                      setSearchInput(cat);
                      searchByCategory(cat);
                    }}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="container mx-auto max-w-6xl px-4 py-6 md:px-6">
            {/* Loading */}
            {isLoading && (
              <div className="flex flex-col items-center justify-center py-24">
                <div className="relative">
                  <div className="h-16 w-16 rounded-full border-4 border-muted" />
                  <div className="absolute inset-0 h-16 w-16 animate-spin rounded-full border-4 border-transparent border-t-primary" />
                </div>
                <p className="mt-4 text-sm font-medium text-muted-foreground">
                  Buscando viajes de la comunidad...
                </p>
              </div>
            )}

            {/* Initial state */}
            {!isLoading && !hasSearched && (
              <div className="flex flex-col items-center justify-center py-24 text-center">
                <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-primary/10">
                  <Users className="h-10 w-10 text-primary" />
                </div>
                <h3 className="mt-6 text-xl font-semibold">
                  Explora viajes de otros viajeros
                </h3>
                <p className="mt-2 max-w-md text-sm text-muted-foreground leading-relaxed">
                  Selecciona una categoría o busca por preferencia para
                  descubrir itinerarios creados y guardados por la comunidad.
                </p>
              </div>
            )}

            {/* Empty results */}
            {!isLoading && hasSearched && trips.length === 0 && (
              <div className="flex flex-col items-center justify-center py-24 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-muted">
                  <Globe className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="mt-4 text-lg font-semibold">
                  No hay viajes para &quot;{selectedCategory}&quot;
                </h3>
                <p className="mt-2 max-w-sm text-sm text-muted-foreground">
                  Aún no hay viajeros que hayan guardado itinerarios con esta
                  preferencia. Prueba con otra categoría.
                </p>
              </div>
            )}

            {/* Results */}
            {!isLoading && trips.length > 0 && (
              <>
                <div className="mb-6 flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-semibold">
                      Viajes con{" "}
                      <span className="capitalize text-primary">
                        {selectedCategory}
                      </span>
                    </h2>
                    <p className="text-xs text-muted-foreground">
                      {trips.length} viaje{trips.length !== 1 && "s"} encontrado
                      {trips.length !== 1 && "s"}
                      {stats.destinos > 0 &&
                        ` · ${stats.destinos} destino${stats.destinos !== 1 ? "s" : ""}`}
                    </p>
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {trips.map((trip) => {
                    const img = getTripImage(trip);
                    const city = getTripCity(trip);
                    const placesCount = getPlacesCount(trip);
                    const exploreUrl = buildExploreUrl(trip);

                    return (
                      <Card
                        key={trip._id}
                        className="group overflow-hidden transition-all hover:shadow-lg hover:border-primary/20"
                      >
                        {/* Image */}
                        <div className="relative aspect-video overflow-hidden bg-muted">
                          {img ? (
                            <Image
                              src={img}
                              alt={city || "Viaje"}
                              fill
                              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                              className="object-cover transition-transform duration-300 group-hover:scale-105"
                              onError={(e) => {
                                (e.target as HTMLImageElement).style.display =
                                  "none";
                              }}
                            />
                          ) : (
                            <div className="flex h-full items-center justify-center bg-linear-to-br from-muted to-muted/50">
                              <ImageOff className="h-10 w-10 text-muted-foreground/20" />
                            </div>
                          )}
                          <div className="absolute left-2 top-2">
                            <Badge className="gap-1 rounded-full bg-white/90 text-[10px] font-medium text-slate-700 shadow-sm backdrop-blur-sm">
                              <Users className="h-3 w-3" />
                              Comunidad
                            </Badge>
                          </div>
                          {placesCount > 0 && (
                            <div className="absolute right-2 top-2">
                              <Badge className="rounded-full bg-black/60 text-[10px] font-medium text-white backdrop-blur-sm">
                                {placesCount} lugares
                              </Badge>
                            </div>
                          )}
                        </div>

                        <CardHeader className="pb-2 pt-4">
                          <CardTitle className="flex items-center gap-2 text-base">
                            <MapPin className="h-4 w-4 shrink-0 text-primary" />
                            <span className="truncate">
                              {city || "Ubicación no disponible"}
                            </span>
                          </CardTitle>
                          <CardDescription className="flex items-center gap-3 text-xs">
                            <span className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {formatDate(trip.createdAt)}
                            </span>
                          </CardDescription>
                        </CardHeader>

                        <CardContent className="pb-4">
                          {/* Preferences */}
                          <div className="mb-3 flex flex-wrap gap-1">
                            {trip.preferencias.slice(0, 5).map((pref) => (
                              <Badge
                                key={pref}
                                variant="secondary"
                                className="rounded-full text-[10px] capitalize"
                              >
                                {pref}
                              </Badge>
                            ))}
                            {trip.preferencias.length > 5 && (
                              <Badge
                                variant="secondary"
                                className="rounded-full text-[10px]"
                              >
                                +{trip.preferencias.length - 5}
                              </Badge>
                            )}
                          </div>

                          {/* Places preview */}
                          {Array.isArray(trip.places) &&
                            trip.places.length > 0 && (
                              <div className="mb-3 space-y-1.5">
                                {trip.places.slice(0, 3).map((place, idx) => (
                                  <div
                                    key={idx}
                                    className="flex items-center gap-2 text-xs text-muted-foreground"
                                  >
                                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-[9px] font-bold text-primary">
                                      {idx + 1}
                                    </span>
                                    <span className="truncate">
                                      {place.name}
                                    </span>
                                  </div>
                                ))}
                                {trip.places.length > 3 && (
                                  <p className="pl-7 text-[10px] text-muted-foreground/60">
                                    +{trip.places.length - 3} lugares más
                                  </p>
                                )}
                              </div>
                            )}

                          {/* Action */}
                          <Link href={exploreUrl}>
                            <Button
                              variant="outline"
                              size="sm"
                              className="w-full gap-2 text-xs cursor-pointer"
                            >
                              <Navigation className="h-3.5 w-3.5" />
                              Explorar este destino
                            </Button>
                          </Link>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </>
            )}
          </div>
        </main>

        <Footer />
      </div>
    </AuthGuard>
  );
}
