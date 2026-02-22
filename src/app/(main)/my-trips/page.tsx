"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  MapPin,
  Calendar,
  Loader2,
  Trash2,
  Eye,
  BookmarkCheck,
  Clock,
  Globe,
  ArrowLeft,
  ImageOff,
  Bookmark,
  Sparkles,
  Search,
  LayoutGrid,
  LayoutList,
  ArrowUpDown,
  ChevronRight,
  Layers,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Header, Footer } from "@/components/layout";
import { AuthGuard } from "@/components/layout/auth-guard";
import { getMyTrips, updateTrip, deleteTrip, type Viaje } from "@/lib/auth";

const estadoConfig: Record<
  string,
  {
    label: string;
    color: string;
    badgeVariant: "default" | "secondary";
    icon: React.ComponentType<{ className?: string }>;
  }
> = {
  generada: {
    label: "Generado",
    color: "text-slate-600 dark:text-slate-400",
    badgeVariant: "secondary",
    icon: Clock,
  },
  guardada: {
    label: "Guardado",
    color: "text-emerald-600 dark:text-emerald-400",
    badgeVariant: "default",
    icon: BookmarkCheck,
  },
};

const filterTabs = [
  { key: "all", label: "Todos", icon: Globe },
  { key: "guardada", label: "Guardados", icon: BookmarkCheck },
  { key: "generada", label: "Generados", icon: Clock },
];

type SortKey = "newest" | "oldest" | "city";
type ViewMode = "grid" | "list";

export default function MyTripsPage() {
  const [trips, setTrips] = useState<Viaje[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("all");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortKey>("newest");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const loadTrips = useCallback(async () => {
    try {
      const data = await getMyTrips();
      setTrips(data.viajes || []);
    } catch (err) {
      const msg =
        err instanceof Error ? err.message : "Error al cargar viajes";
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadTrips();
  }, [loadTrips]);

  const filteredAndSortedTrips = useMemo(() => {
    let result =
      activeFilter === "all"
        ? trips
        : trips.filter((t) => t.estado === activeFilter);

    // Search filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter((t) => {
        const city = t.ubicacion?.city?.toLowerCase() || "";
        const prefs = t.preferencias.join(" ").toLowerCase();
        return city.includes(q) || prefs.includes(q);
      });
    }

    // Sort
    const sorted = [...result];
    switch (sortBy) {
      case "newest":
        sorted.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        break;
      case "oldest":
        sorted.sort(
          (a, b) =>
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );
        break;
      case "city":
        sorted.sort((a, b) => {
          const ca = a.ubicacion?.city || "zzz";
          const cb = b.ubicacion?.city || "zzz";
          return ca.localeCompare(cb);
        });
        break;
    }

    return sorted;
  }, [trips, activeFilter, searchQuery, sortBy]);

  async function handleDelete(tripId: string) {
    setDeletingId(tripId);
    setConfirmDeleteId(null);
    try {
      await deleteTrip(tripId);
      setTrips((prev) => prev.filter((t) => t._id !== tripId));
      toast.success("Viaje eliminado");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Error al eliminar";
      toast.error(msg);
    } finally {
      setDeletingId(null);
    }
  }

  async function handleSave(tripId: string) {
    setSavingId(tripId);
    try {
      await updateTrip(tripId, { estado: "guardada" });
      setTrips((prev) =>
        prev.map((t) =>
          t._id === tripId ? { ...t, estado: "guardada" as const } : t
        )
      );
      toast.success("Viaje guardado");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Error al guardar";
      toast.error(msg);
    } finally {
      setSavingId(null);
    }
  }

  function formatDate(dateStr: string) {
    return new Date(dateStr).toLocaleDateString("es-ES", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  }

  function formatDateRelative(dateStr: string) {
    const now = new Date();
    const date = new Date(dateStr);
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "Hoy";
    if (diffDays === 1) return "Ayer";
    if (diffDays < 7) return `Hace ${diffDays} dias`;
    if (diffDays < 30) return `Hace ${Math.floor(diffDays / 7)} sem.`;
    return formatDate(dateStr);
  }

  function getTripImage(trip: Viaje): string | null {
    if (trip.places && Array.isArray(trip.places) && trip.places.length > 0) {
      return trip.places[0].image_url || null;
    }
    return null;
  }

  function getTripCity(trip: Viaje): string {
    return trip.ubicacion?.city || "Sin ciudad";
  }

  function getPlacesCount(trip: Viaje): number {
    return Array.isArray(trip.places) ? trip.places.length : 0;
  }

  // Stats
  const stats = {
    total: trips.length,
    guardados: trips.filter((t) => t.estado === "guardada").length,
    generados: trips.filter((t) => t.estado === "generada").length,
    destinos: new Set(
      trips.map((t) => getTripCity(t)).filter((c) => c !== "Sin ciudad")
    ).size,
    totalPlaces: trips.reduce(
      (acc, t) => acc + (Array.isArray(t.places) ? t.places.length : 0),
      0
    ),
  };

  return (
    <AuthGuard>
      <div className="flex min-h-screen flex-col bg-muted/20">
        <Header />

        <main className="flex-1">
          {/* Hero Header */}
          <div className="relative overflow-hidden border-b bg-background">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,var(--tw-gradient-stops))] from-blue-500/5 via-transparent to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-primary/20 to-transparent" />
            <div className="container relative mx-auto max-w-7xl px-4 py-6 md:px-6 lg:py-8">
              {/* Back + Title */}
              <div className="flex items-center gap-3 mb-6">
                <Link href="/dashboard">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-9 w-9 cursor-pointer rounded-xl"
                  >
                    <ArrowLeft className="h-4 w-4" />
                  </Button>
                </Link>
                <div className="flex-1">
                  <h1 className="text-xl font-bold tracking-tight sm:text-2xl md:text-3xl">
                    Mis Viajes
                  </h1>
                  <p className="text-xs text-muted-foreground sm:text-sm">
                    Gestiona tus exploraciones y viajes guardados
                  </p>
                </div>
                <Link href="/explore" className="hidden sm:block">
                  <Button size="sm" className="gap-2 cursor-pointer shadow-md shadow-primary/20">
                    <Sparkles className="h-4 w-4" />
                    Nueva exploracion
                  </Button>
                </Link>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-3 sm:grid-cols-5">
                {[
                  { label: "Total", value: stats.total, color: "text-foreground" },
                  { label: "Guardados", value: stats.guardados, color: "text-emerald-600 dark:text-emerald-400" },
                  { label: "Generados", value: stats.generados, color: "text-slate-500" },
                  { label: "Destinos", value: stats.destinos, color: "text-violet-600 dark:text-violet-400" },
                  { label: "Lugares", value: stats.totalPlaces, color: "text-amber-600 dark:text-amber-400" },
                ].map((stat) => (
                  <div
                    key={stat.label}
                    className="rounded-xl border bg-card p-3 text-center transition-colors"
                  >
                    <p className={`text-lg font-bold tabular-nums sm:text-2xl ${stat.color}`}>
                      {stat.value}
                    </p>
                    <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground sm:text-xs">
                      {stat.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="container mx-auto max-w-7xl px-4 py-5 md:px-6 lg:py-6">
            {/* Toolbar */}
            <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              {/* Left: Filters */}
              <div className="flex items-center gap-1.5 overflow-x-auto">
                {filterTabs.map((tab) => {
                  const count =
                    tab.key === "all"
                      ? trips.length
                      : trips.filter((t) => t.estado === tab.key).length;
                  const Icon = tab.icon;
                  const isActive = activeFilter === tab.key;
                  return (
                    <button
                      key={tab.key}
                      type="button"
                      className={`inline-flex shrink-0 items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition-all cursor-pointer ${
                        isActive
                          ? "border-primary bg-primary text-primary-foreground shadow-sm"
                          : "border-transparent bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground"
                      }`}
                      onClick={() => setActiveFilter(tab.key)}
                    >
                      <Icon className="h-3.5 w-3.5" />
                      {tab.label}
                      <span
                        className={`ml-0.5 rounded-full px-1.5 py-0.5 text-[10px] tabular-nums ${
                          isActive
                            ? "bg-primary-foreground/20 text-primary-foreground"
                            : "bg-background text-muted-foreground"
                        }`}
                      >
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Right: Search, Sort, View */}
              <div className="flex items-center gap-2">
                {/* Search */}
                <div className="relative flex-1 sm:w-48 sm:flex-none">
                  <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Buscar..."
                    className="flex h-8 w-full rounded-lg border border-input bg-background pl-8 pr-3 text-xs transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary/30"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>

                {/* Sort */}
                <div className="relative">
                  <select
                    className="h-8 cursor-pointer appearance-none rounded-lg border bg-background pl-2.5 pr-7 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary/30"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as SortKey)}
                  >
                    <option value="newest">Recientes</option>
                    <option value="oldest">Antiguos</option>
                    <option value="city">Ciudad A-Z</option>
                  </select>
                  <ArrowUpDown className="pointer-events-none absolute right-2 top-1/2 h-3 w-3 -translate-y-1/2 text-muted-foreground" />
                </div>

                {/* View toggle */}
                <div className="hidden items-center rounded-lg border bg-muted/50 p-0.5 sm:flex">
                  <button
                    type="button"
                    className={`cursor-pointer rounded-md p-1.5 transition-colors ${
                      viewMode === "grid"
                        ? "bg-background text-foreground shadow-sm"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                    onClick={() => setViewMode("grid")}
                  >
                    <LayoutGrid className="h-3.5 w-3.5" />
                  </button>
                  <button
                    type="button"
                    className={`cursor-pointer rounded-md p-1.5 transition-colors ${
                      viewMode === "list"
                        ? "bg-background text-foreground shadow-sm"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                    onClick={() => setViewMode("list")}
                  >
                    <LayoutList className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Loading */}
            {isLoading && (
              <div className="flex flex-col items-center justify-center py-24">
                <div className="relative">
                  <div className="h-14 w-14 rounded-full border-4 border-muted" />
                  <div className="absolute inset-0 h-14 w-14 animate-spin rounded-full border-4 border-transparent border-t-primary" />
                </div>
                <p className="mt-4 text-sm text-muted-foreground">
                  Cargando tus viajes...
                </p>
              </div>
            )}

            {/* Empty state */}
            {!isLoading && filteredAndSortedTrips.length === 0 && (
              <div className="flex flex-col items-center justify-center py-24 text-center">
                <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-muted">
                  {searchQuery ? (
                    <Search className="h-9 w-9 text-muted-foreground/30" />
                  ) : (
                    <Globe className="h-9 w-9 text-muted-foreground/30" />
                  )}
                </div>
                <h3 className="mt-5 text-lg font-semibold">
                  {searchQuery
                    ? `Sin resultados para "${searchQuery}"`
                    : activeFilter === "all"
                      ? "Aun no tienes viajes"
                      : "No hay viajes con este filtro"}
                </h3>
                <p className="mt-2 max-w-sm text-sm text-muted-foreground">
                  {searchQuery
                    ? "Intenta con otros terminos de busqueda."
                    : activeFilter === "all"
                      ? "Explora destinos y guarda tus recomendaciones favoritas para verlas aqui."
                      : "Prueba con otro filtro o explora nuevos destinos."}
                </p>
                {!searchQuery && (
                  <Link href="/explore">
                    <Button className="mt-6 gap-2 cursor-pointer">
                      <Sparkles className="h-4 w-4" />
                      Explorar destinos
                    </Button>
                  </Link>
                )}
              </div>
            )}

            {/* GRID VIEW */}
            {!isLoading &&
              filteredAndSortedTrips.length > 0 &&
              viewMode === "grid" && (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {filteredAndSortedTrips.map((trip) => {
                    const img = getTripImage(trip);
                    const city = getTripCity(trip);
                    const placesCount = getPlacesCount(trip);
                    const config =
                      estadoConfig[trip.estado] || estadoConfig.generada;
                    const StatusIcon = config.icon;

                    return (
                      <Card
                        key={trip._id}
                        className="group overflow-hidden transition-all hover:shadow-lg hover:border-primary/20"
                      >
                        {/* Image */}
                        <div className="relative aspect-16/10 overflow-hidden bg-muted">
                          {img ? (
                            <Image
                              src={img}
                              alt={city}
                              fill
                              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                              className="object-cover transition-transform duration-500 group-hover:scale-105"
                              onError={(e) => {
                                (e.target as HTMLImageElement).style.display =
                                  "none";
                              }}
                            />
                          ) : (
                            <div className="flex h-full items-center justify-center">
                              <ImageOff className="h-10 w-10 text-muted-foreground/15" />
                            </div>
                          )}
                          {/* Gradient overlay */}
                          <div className="absolute inset-0 bg-linear-to-t from-black/40 via-transparent to-transparent" />
                          {/* Status badge */}
                          <div className="absolute right-2.5 top-2.5">
                            <Badge
                              variant={config.badgeVariant}
                              className="gap-1 rounded-full text-[10px] font-medium shadow-sm backdrop-blur-sm"
                            >
                              <StatusIcon className="h-3 w-3" />
                              {config.label}
                            </Badge>
                          </div>
                          {/* City overlay */}
                          <div className="absolute bottom-2.5 left-3 right-3">
                            <h3 className="flex items-center gap-1.5 text-sm font-bold text-white drop-shadow-md">
                              <MapPin className="h-3.5 w-3.5 shrink-0" />
                              <span className="truncate">{city}</span>
                            </h3>
                          </div>
                        </div>

                        <CardContent className="p-4">
                          {/* Meta */}
                          <div className="mb-3 flex items-center gap-3 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {formatDateRelative(trip.createdAt)}
                            </span>
                            <span className="flex items-center gap-1">
                              <Layers className="h-3 w-3" />
                              {placesCount} lugares
                            </span>
                          </div>

                          {/* Preferences tags */}
                          <div className="mb-4 flex flex-wrap gap-1">
                            {trip.preferencias.slice(0, 3).map((pref) => (
                              <span
                                key={pref}
                                className="inline-flex rounded-md bg-muted px-2 py-0.5 text-[10px] font-medium capitalize text-muted-foreground"
                              >
                                {pref}
                              </span>
                            ))}
                            {trip.preferencias.length > 3 && (
                              <span className="inline-flex rounded-md bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
                                +{trip.preferencias.length - 3}
                              </span>
                            )}
                          </div>

                          {/* Actions */}
                          <div className="flex gap-2">
                            <Link
                              href={`/explore?tripId=${trip._id}`}
                              className="flex-1"
                            >
                              <Button
                                variant="default"
                                size="sm"
                                className="w-full gap-1.5 text-xs cursor-pointer"
                              >
                                <Eye className="h-3.5 w-3.5" />
                                Ver viaje
                              </Button>
                            </Link>
                            {trip.estado === "generada" && (
                              <Button
                                variant="outline"
                                size="sm"
                                className="gap-1.5 text-xs cursor-pointer"
                                onClick={() => handleSave(trip._id)}
                                disabled={savingId === trip._id}
                              >
                                {savingId === trip._id ? (
                                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                ) : (
                                  <Bookmark className="h-3.5 w-3.5" />
                                )}
                              </Button>
                            )}
                            {/* Delete with confirm */}
                            {confirmDeleteId === trip._id ? (
                              <div className="flex items-center gap-1">
                                <Button
                                  variant="destructive"
                                  size="sm"
                                  className="h-8 gap-1 px-2 text-[10px] cursor-pointer"
                                  onClick={() => handleDelete(trip._id)}
                                  disabled={deletingId === trip._id}
                                >
                                  {deletingId === trip._id ? (
                                    <Loader2 className="h-3 w-3 animate-spin" />
                                  ) : (
                                    "Si"
                                  )}
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-8 px-2 text-[10px] cursor-pointer"
                                  onClick={() => setConfirmDeleteId(null)}
                                >
                                  No
                                </Button>
                              </div>
                            ) : (
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-xs text-muted-foreground hover:text-destructive cursor-pointer"
                                onClick={() => setConfirmDeleteId(trip._id)}
                                disabled={deletingId === trip._id}
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </Button>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              )}

            {/* LIST VIEW */}
            {!isLoading &&
              filteredAndSortedTrips.length > 0 &&
              viewMode === "list" && (
                <Card>
                  <CardContent className="p-0">
                    <div className="divide-y">
                      {filteredAndSortedTrips.map((trip) => {
                        const img = getTripImage(trip);
                        const city = getTripCity(trip);
                        const placesCount = getPlacesCount(trip);
                        const config =
                          estadoConfig[trip.estado] || estadoConfig.generada;

                        return (
                          <div
                            key={trip._id}
                            className="flex items-center gap-3 p-3 transition-colors hover:bg-muted/30 sm:gap-4 sm:p-4"
                          >
                            {/* Thumbnail */}
                            <div className="h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-muted sm:h-16 sm:w-20">
                              {img ? (
                                <Image
                                  src={img}
                                  alt={city}
                                  width={80}
                                  height={64}
                                  className="h-full w-full object-cover"
                                  onError={(e) => {
                                    (
                                      e.target as HTMLImageElement
                                    ).style.display = "none";
                                  }}
                                />
                              ) : (
                                <div className="flex h-full items-center justify-center">
                                  <ImageOff className="h-5 w-5 text-muted-foreground/20" />
                                </div>
                              )}
                            </div>

                            {/* Info */}
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center gap-2">
                                <MapPin className="h-3.5 w-3.5 shrink-0 text-primary" />
                                <p className="truncate text-sm font-semibold">
                                  {city}
                                </p>
                                <Badge
                                  variant={config.badgeVariant}
                                  className="shrink-0 rounded-full px-2 py-0 text-[9px]"
                                >
                                  {config.label}
                                </Badge>
                              </div>
                              <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
                                <span className="flex items-center gap-1">
                                  <Calendar className="h-3 w-3" />
                                  {formatDate(trip.createdAt)}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Layers className="h-3 w-3" />
                                  {placesCount} lugares
                                </span>
                                <span className="hidden sm:flex items-center gap-1">
                                  {trip.preferencias.slice(0, 3).map((pref) => (
                                    <span
                                      key={pref}
                                      className="inline-flex rounded bg-muted px-1.5 py-0.5 text-[10px] capitalize"
                                    >
                                      {pref}
                                    </span>
                                  ))}
                                </span>
                              </div>
                            </div>

                            {/* Actions */}
                            <div className="flex shrink-0 items-center gap-1.5">
                              {trip.estado === "generada" && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-8 w-8 p-0 text-blue-600 hover:text-blue-700 cursor-pointer"
                                  onClick={() => handleSave(trip._id)}
                                  disabled={savingId === trip._id}
                                >
                                  {savingId === trip._id ? (
                                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                  ) : (
                                    <Bookmark className="h-3.5 w-3.5" />
                                  )}
                                </Button>
                              )}
                              {confirmDeleteId === trip._id ? (
                                <div className="flex items-center gap-1">
                                  <Button
                                    variant="destructive"
                                    size="sm"
                                    className="h-7 px-2 text-[10px] cursor-pointer"
                                    onClick={() => handleDelete(trip._id)}
                                    disabled={deletingId === trip._id}
                                  >
                                    {deletingId === trip._id ? (
                                      <Loader2 className="h-3 w-3 animate-spin" />
                                    ) : (
                                      "Si"
                                    )}
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-7 px-2 text-[10px] cursor-pointer"
                                    onClick={() => setConfirmDeleteId(null)}
                                  >
                                    No
                                  </Button>
                                </div>
                              ) : (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive cursor-pointer"
                                  onClick={() => setConfirmDeleteId(trip._id)}
                                  disabled={deletingId === trip._id}
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                </Button>
                              )}
                              <Link href={`/explore?tripId=${trip._id}`}>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-8 w-8 p-0 cursor-pointer"
                                >
                                  <ChevronRight className="h-4 w-4" />
                                </Button>
                              </Link>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              )}

            {/* Results count */}
            {!isLoading && filteredAndSortedTrips.length > 0 && (
              <p className="mt-4 text-center text-xs text-muted-foreground">
                Mostrando {filteredAndSortedTrips.length} de {trips.length} viaje
                {trips.length !== 1 && "s"}
              </p>
            )}
          </div>
        </main>

        <Footer />
      </div>
    </AuthGuard>
  );
}
