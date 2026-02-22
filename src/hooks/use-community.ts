"use client";

import { useEffect, useState, useCallback } from "react";
import { toast } from "sonner";
import { getCommunityTrips } from "@/services/trips.service";
import { fetchAvailablePreferences } from "@/services/user.service";
import type { Viaje } from "@/types";

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

export function useCommunity() {
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

  const stats = {
    total: trips.length,
    destinos: new Set(
      trips.map((t) => t.ubicacion?.city).filter(Boolean)
    ).size,
  };

  return {
    trips,
    isLoading,
    hasSearched,
    selectedCategory,
    availableCategories,
    searchInput,
    setSearchInput,
    searchByCategory,
    handleSearchSubmit,
    stats,
  };
}
