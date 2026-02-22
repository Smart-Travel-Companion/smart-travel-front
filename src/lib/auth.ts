const API_URL = process.env.NEXT_PUBLIC_API_URL;

// Tipos
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

// Viaje (Trip) types
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

// Errores personalizados
export class AuthError extends Error {
  constructor(
    message: string,
    public statusCode?: number
  ) {
    super(message);
    this.name = "AuthError";
  }
}

// Funciones de autenticación
export async function login(credentials: LoginCredentials): Promise<AuthResponse> {
  try {
    const response = await fetch(`${API_URL}/api/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new AuthError(
        data.mensaje || data.message || "Error al iniciar sesión",
        response.status
      );
    }

    // Guardar token y usuario
    saveToken(data.token);
    saveUser(data.usuario);

    return data;
  } catch (error) {
    if (error instanceof AuthError) {
      throw error;
    }
    throw new AuthError("Error de conexión. Intenta de nuevo.");
  }
}

export async function register(data: RegisterData): Promise<AuthResponse> {
  try {
    const response = await fetch(`${API_URL}/api/auth/registrar`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const responseData = await response.json();

    if (!response.ok) {
      throw new AuthError(
        responseData.mensaje || responseData.message || "Error al crear cuenta",
        response.status
      );
    }

    // Guardar token y usuario
    saveToken(responseData.token);
    saveUser(responseData.usuario);

    return responseData;
  } catch (error) {
    if (error instanceof AuthError) {
      throw error;
    }
    throw new AuthError("Error de conexión. Intenta de nuevo.");
  }
}

// Funciones de almacenamiento
export function saveToken(token: string): void {
  if (typeof window !== "undefined") {
    localStorage.setItem("auth_token", token);
  }
}

export function getToken(): string | null {
  if (typeof window !== "undefined") {
    return localStorage.getItem("auth_token");
  }
  return null;
}

export function removeToken(): void {
  if (typeof window !== "undefined") {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("auth_user");
  }
}

export function saveUser(user: User): void {
  if (typeof window !== "undefined") {
    localStorage.setItem("auth_user", JSON.stringify(user));
  }
}

export function getUser(): User | null {
  if (typeof window !== "undefined") {
    const user = localStorage.getItem("auth_user");
    return user ? JSON.parse(user) : null;
  }
  return null;
}

export function isAuthenticated(): boolean {
  return !!getToken();
}

export function logout(): void {
  removeToken();
}

// Actualizar perfil del usuario
export async function updateUser(
  userId: string,
  data: Partial<Pick<User, "nombre" | "telefono" | "pais" | "ciudad" | "bio" | "foto">>
): Promise<User> {
  const token = getToken();
  if (!token) throw new AuthError("No hay sesión activa", 401);

  try {
    const response = await fetch(`${API_URL}/api/users/${userId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    const responseData = await response.json();

    if (!response.ok) {
      throw new AuthError(
        responseData.mensaje || responseData.message || "Error al actualizar perfil",
        response.status
      );
    }

    const user = responseData.usuario || responseData;
    saveUser(user);
    return user;
  } catch (error) {
    if (error instanceof AuthError) throw error;
    throw new AuthError("Error de conexión. Intenta de nuevo.");
  }
}

// Actualizar preferencias del usuario
export async function updatePreferences(
  userId: string,
  preferencias: string[]
): Promise<string[]> {
  const token = getToken();
  if (!token) throw new AuthError("No hay sesión activa", 401);

  try {
    const response = await fetch(`${API_URL}/api/users/${userId}/preferencias`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ preferencias }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new AuthError(
        data.mensaje || data.message || "Error al actualizar preferencias",
        response.status
      );
    }

    return data.preferencias || preferencias;
  } catch (error) {
    if (error instanceof AuthError) throw error;
    throw new AuthError("Error de conexión. Intenta de nuevo.");
  }
}

// Obtener catálogo de preferencias disponibles
export async function fetchAvailablePreferences(): Promise<string[]> {
  try {
    const response = await fetch(`${API_URL}/api/preferencias`);
    const data = await response.json();

    if (!response.ok) {
      throw new AuthError("Error al obtener preferencias", response.status);
    }

    return data.preferencias || [];
  } catch (error) {
    if (error instanceof AuthError) throw error;
    throw new AuthError("Error de conexión. Intenta de nuevo.");
  }
}

// Obtener recomendaciones de lugares
export async function getRecomendaciones(
  params: RecomendacionesByCity | RecomendacionesByCoords
): Promise<RecomendacionesResponse> {
  const token = getToken();
  if (!token) throw new AuthError("No hay sesión activa", 401);

  try {
    const response = await fetch(`${API_URL}/api/recomendaciones`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(params),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new AuthError(
        data.mensaje || data.message || "Error al obtener recomendaciones",
        response.status
      );
    }

    return data;
  } catch (error) {
    if (error instanceof AuthError) throw error;
    throw new AuthError("Error de conexión. Intenta de nuevo.");
  }
}

// === VIAJES (Trips) API ===

// Obtener viajes del usuario autenticado
export async function getMyTrips(): Promise<ViajesResponse> {
  const token = getToken();
  if (!token) throw new AuthError("No hay sesión activa", 401);

  try {
    const response = await fetch(`${API_URL}/api/viajes`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await response.json();
    if (!response.ok) {
      throw new AuthError(data.mensaje || "Error al obtener viajes", response.status);
    }
    return data;
  } catch (error) {
    if (error instanceof AuthError) throw error;
    throw new AuthError("Error de conexión. Intenta de nuevo.");
  }
}

// Obtener viajes por estado
export async function getTripsByStatus(estado: string): Promise<ViajesResponse> {
  const token = getToken();
  if (!token) throw new AuthError("No hay sesión activa", 401);

  try {
    const response = await fetch(`${API_URL}/api/viajes/estado/${estado}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await response.json();
    if (!response.ok) {
      throw new AuthError(data.mensaje || "Error al obtener viajes", response.status);
    }
    return data;
  } catch (error) {
    if (error instanceof AuthError) throw error;
    throw new AuthError("Error de conexión. Intenta de nuevo.");
  }
}

// Actualizar un viaje (estado, notas, preferedPlaces)
export async function updateTrip(
  tripId: string,
  data: { estado?: string; notas?: string; preferedPlaces?: number[] }
): Promise<Viaje> {
  const token = getToken();
  if (!token) throw new AuthError("No hay sesión activa", 401);

  try {
    const response = await fetch(`${API_URL}/api/viajes/${tripId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
    const responseData = await response.json();
    if (!response.ok) {
      throw new AuthError(responseData.mensaje || "Error al actualizar viaje", response.status);
    }
    return responseData.viaje || responseData;
  } catch (error) {
    if (error instanceof AuthError) throw error;
    throw new AuthError("Error de conexión. Intenta de nuevo.");
  }
}

// Obtener un viaje por ID
export async function getTripById(tripId: string): Promise<Viaje> {
  const token = getToken();
  if (!token) throw new AuthError("No hay sesión activa", 401);

  try {
    const response = await fetch(`${API_URL}/api/viajes/${tripId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await response.json();
    if (!response.ok) {
      throw new AuthError(data.mensaje || "Error al obtener viaje", response.status);
    }
    return data;
  } catch (error) {
    if (error instanceof AuthError) throw error;
    throw new AuthError("Error de conexión. Intenta de nuevo.");
  }
}

// Eliminar un viaje
export async function deleteTrip(tripId: string): Promise<void> {
  const token = getToken();
  if (!token) throw new AuthError("No hay sesión activa", 401);

  try {
    const response = await fetch(`${API_URL}/api/viajes/${tripId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!response.ok) {
      const data = await response.json();
      throw new AuthError(data.mensaje || "Error al eliminar viaje", response.status);
    }
  } catch (error) {
    if (error instanceof AuthError) throw error;
    throw new AuthError("Error de conexión. Intenta de nuevo.");
  }
}

// Obtener viajes de la comunidad por preferencia (público)
export async function getCommunityTrips(preferencia: string): Promise<ViajesResponse> {
  try {
    const response = await fetch(
      `${API_URL}/api/viajes/preferencia/${encodeURIComponent(preferencia)}`
    );
    const data = await response.json();
    if (!response.ok) {
      throw new AuthError(data.mensaje || "Error al obtener viajes", response.status);
    }
    return data;
  } catch (error) {
    if (error instanceof AuthError) throw error;
    throw new AuthError("Error de conexión. Intenta de nuevo.");
  }
}

// Obtener perfil del usuario autenticado
export async function fetchProfile(): Promise<User> {
  const token = getToken();
  if (!token) {
    throw new AuthError("No hay sesión activa", 401);
  }

  try {
    const response = await fetch(`${API_URL}/api/auth/perfil`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      // Token expirado o inválido
      if (response.status === 401) {
        removeToken();
      }
      throw new AuthError(
        data.mensaje || data.message || "Error al obtener perfil",
        response.status
      );
    }

    const user = data.usuario || data;
    saveUser(user);
    return user;
  } catch (error) {
    if (error instanceof AuthError) {
      throw error;
    }
    throw new AuthError("Error de conexión. Intenta de nuevo.");
  }
}
