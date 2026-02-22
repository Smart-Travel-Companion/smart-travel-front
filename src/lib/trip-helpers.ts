import type { Viaje } from "@/types";

/** Get the first image URL from a trip's places */
export function getTripImage(trip: Viaje): string | null {
  if (trip.places && Array.isArray(trip.places) && trip.places.length > 0) {
    return trip.places[0].image_url || null;
  }
  return null;
}

/** Get the city name from a trip, with fallback */
export function getTripCity(trip: Viaje): string {
  return trip.ubicacion?.city || "Sin ciudad";
}

/** Count places in a trip */
export function getPlacesCount(trip: Viaje): number {
  return Array.isArray(trip.places) ? trip.places.length : 0;
}

/** Build an explore URL from a trip's location data */
export function buildExploreUrl(trip: Viaje): string {
  const city = trip.ubicacion?.city;
  const coords = trip.ubicacion?.coordinates;
  const params = new URLSearchParams();
  if (city) params.set("city", city);
  if (coords?.latitude && coords?.longitude) {
    params.set("lat", String(coords.latitude));
    params.set("lon", String(coords.longitude));
  }
  const qs = params.toString();
  return qs ? `/explore?${qs}` : "/explore";
}
