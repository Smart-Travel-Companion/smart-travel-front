// === Auth Types ===

export interface User {
  _id: string;
  nombre: string;
  email: string;
  preferencias?: string[];
  telefono?: string;
  pais?: string;
  ciudad?: string;
  foto?: string;
  bio?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface AuthResponse {
  token: string;
  usuario: User;
}

export interface LoginCredentials {
  email: string;
  contraseña: string;
}

export interface RegisterData {
  nombre: string;
  email: string;
  contraseña: string;
  contraseñaConfirm: string;
}

// === Place & Recommendation Types ===

export interface Place {
  name: string;
  category: string;
  distance_km: number;
  short_reason: string;
  description: string;
  address: string;
  latitude: number;
  longitude: number;
  image_url: string;
  images: string[];
  opening_hours: string;
  estimated_time_min: number;
}

export interface RecomendacionesResponse {
  places: Place[];
  viajeId?: string;
}

export interface RecomendacionesByCity {
  city: string;
  address?: string;
  radiusKm?: number;
  language?: string;
}

export interface RecomendacionesByCoords {
  city?: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
  radiusKm?: number;
  language?: string;
}

// === Trip (Viaje) Types ===

export interface Viaje {
  _id: string;
  user?: { nombre: string; email: string } | string;
  preferencias: string[];
  ubicacion: {
    city?: string;
    address?: string;
    coordinates?: { latitude: number; longitude: number };
    radiusKm: number;
  };
  places: Place[];
  preferedPlaces: number[];
  language: string;
  estado: "generada" | "guardada";
  notas?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ViajesResponse {
  total: number;
  viajes: Viaje[];
}

// === Error Types ===

export class AuthError extends Error {
  constructor(
    message: string,
    public statusCode?: number
  ) {
    super(message);
    this.name = "AuthError";
  }
}

// === UI Types ===

export interface NavItem {
  title: string;
  href: string;
  description?: string;
  disabled?: boolean;
  external?: boolean;
  icon?: React.ComponentType<{ className?: string }>;
}

export interface Feature {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
}

export interface Partner {
  name: string;
  logo: string;
}

export interface Step {
  number: number;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
}
