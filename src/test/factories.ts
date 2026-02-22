import type { User, Viaje, Place, AuthResponse, ViajesResponse } from "@/types";

export function buildUser(overrides: Partial<User> = {}): User {
  return {
    _id: "user-1",
    nombre: "Juan Perez",
    email: "juan@test.com",
    preferencias: ["playa", "cultura"],
    telefono: "+573001234567",
    pais: "Colombia",
    ciudad: "Bogota",
    bio: "Viajero frecuente",
    createdAt: "2025-01-15T10:00:00Z",
    updatedAt: "2025-06-01T10:00:00Z",
    ...overrides,
  };
}

export function buildPlace(overrides: Partial<Place> = {}): Place {
  return {
    name: "Museo del Oro",
    category: "cultura, historia",
    distance_km: 2.5,
    short_reason: "Imperdible",
    description: "El museo mas importante de Colombia",
    address: "Cra 6 #15-88",
    latitude: 4.601,
    longitude: -74.072,
    image_url: "https://example.com/museo.jpg",
    images: ["https://example.com/museo2.jpg"],
    opening_hours: "9:00 - 17:00",
    estimated_time_min: 120,
    ...overrides,
  };
}

export function buildViaje(overrides: Partial<Viaje> = {}): Viaje {
  return {
    _id: "trip-1",
    preferencias: ["cultura"],
    ubicacion: {
      city: "Bogota",
      address: "Centro historico",
      coordinates: { latitude: 4.601, longitude: -74.072 },
      radiusKm: 10,
    },
    places: [buildPlace()],
    preferedPlaces: [0],
    language: "es",
    estado: "generada",
    createdAt: "2025-06-01T10:00:00Z",
    updatedAt: "2025-06-01T10:00:00Z",
    ...overrides,
  };
}

export function buildViajesResponse(
  viajes: Viaje[] = [buildViaje()]
): ViajesResponse {
  return { total: viajes.length, viajes };
}

export function buildAuthResponse(
  overrides: Partial<AuthResponse> = {}
): AuthResponse {
  return {
    token: "fake-jwt-token-123",
    usuario: buildUser(),
    ...overrides,
  };
}
