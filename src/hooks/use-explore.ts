"use client";

import { useEffect, useState, useCallback, useRef, useMemo } from "react";
import { toast } from "sonner";
import { useNominatim, type NominatimPlace } from "@/hooks/use-nominatim";
import { getRecomendaciones } from "@/services/recommendations.service";
import { updateTrip, getTripById } from "@/services/trips.service";
import type { Place } from "@/types";

export interface UseExploreParams {
  cityParam: string;
  latParam: string | null;
  lonParam: string | null;
  tripIdParam: string | null;
}

export function useExplore({
  cityParam,
  latParam,
  lonParam,
  tripIdParam,
}: UseExploreParams) {
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

  // Auto-load on mount
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

  return {
    // State
    query,
    setQuery,
    displayCity,
    isSearching,
    hasSearched,
    error,
    activeIndex,
    flyToTrigger,
    showDropdown,
    isSaved,
    isSaving,
    isViewingTrip,
    viajeId,
    places,

    // Derived
    allCategories,
    filteredPlaces,
    selectedCategories,
    hasResults,
    selectedPlace,

    // Nominatim
    suggestions,
    nominatimLoading,

    // Handlers
    handleInputChange,
    handleSelectSuggestion,
    handleSearchSubmit,
    handleSelectPlace,
    handleSaveTrip,
    toggleCategory,
    clearFilters,
    performSearch,

    // Refs
    detailRef,

    // Params (for retry)
    latParam,
    lonParam,
    cityParam,
  };
}
