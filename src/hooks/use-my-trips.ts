"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { toast } from "sonner";
import { getMyTrips, updateTrip, deleteTrip } from "@/services/trips.service";
import { getTripCity } from "@/lib/trip-helpers";
import type { Viaje } from "@/types";

export type SortKey = "newest" | "oldest" | "city";
export type ViewMode = "grid" | "list";

export interface MyTripsStats {
  total: number;
  guardados: number;
  generados: number;
  destinos: number;
  totalPlaces: number;
}

export function useMyTrips() {
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

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter((t) => {
        const city = t.ubicacion?.city?.toLowerCase() || "";
        const prefs = t.preferencias.join(" ").toLowerCase();
        return city.includes(q) || prefs.includes(q);
      });
    }

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

  const handleDelete = useCallback(async (tripId: string) => {
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
  }, []);

  const handleSave = useCallback(async (tripId: string) => {
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
  }, []);

  const stats: MyTripsStats = useMemo(() => ({
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
  }), [trips]);

  return {
    trips,
    isLoading,
    activeFilter,
    setActiveFilter,
    deletingId,
    savingId,
    searchQuery,
    setSearchQuery,
    sortBy,
    setSortBy,
    viewMode,
    setViewMode,
    confirmDeleteId,
    setConfirmDeleteId,
    filteredAndSortedTrips,
    handleDelete,
    handleSave,
    stats,
  };
}
