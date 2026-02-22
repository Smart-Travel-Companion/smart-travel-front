"use client";

import { useEffect, useState, useMemo } from "react";
import { getMyTrips } from "@/services/trips.service";
import type { Viaje } from "@/types";

export interface DashboardStats {
  totalTrips: number;
  savedTrips: number;
  uniqueDestinations: number;
  totalPlaces: number;
}

export function useDashboard() {
  const [trips, setTrips] = useState<Viaje[]>([]);
  const [isLoadingTrips, setIsLoadingTrips] = useState(true);

  useEffect(() => {
    getMyTrips()
      .then((data) => setTrips(data.viajes || []))
      .catch(() => setTrips([]))
      .finally(() => setIsLoadingTrips(false));
  }, []);

  const stats: DashboardStats = useMemo(() => {
    const savedTrips = trips.filter((t) => t.estado === "guardada").length;
    const uniqueDestinations = new Set(
      trips.map((t) => t.ubicacion?.city).filter(Boolean)
    ).size;
    const totalPlaces = trips.reduce(
      (acc, t) => acc + (Array.isArray(t.places) ? t.places.length : 0),
      0
    );
    return {
      totalTrips: trips.length,
      savedTrips,
      uniqueDestinations,
      totalPlaces,
    };
  }, [trips]);

  const recentTrips = useMemo(
    () =>
      [...trips]
        .sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )
        .slice(0, 6),
    [trips]
  );

  return {
    trips,
    isLoadingTrips,
    stats,
    recentTrips,
  };
}
