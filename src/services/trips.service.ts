import type { Viaje, ViajesResponse } from "@/types";
import { AuthError } from "@/types";
import { apiFetch } from "./api-client";
import { getToken } from "./token.service";

export async function getMyTrips(): Promise<ViajesResponse> {
  return apiFetch<ViajesResponse>("/api/viajes", { auth: true });
}

export async function getTripsByStatus(estado: string): Promise<ViajesResponse> {
  return apiFetch<ViajesResponse>(`/api/viajes/estado/${estado}`, { auth: true });
}

export async function updateTrip(
  tripId: string,
  data: { estado?: string; notas?: string; preferedPlaces?: number[] }
): Promise<Viaje> {
  const responseData = await apiFetch<{ viaje?: Viaje } & Viaje>(
    `/api/viajes/${tripId}`,
    {
      method: "PUT",
      auth: true,
      body: JSON.stringify(data),
    }
  );
  return responseData.viaje || responseData;
}

export async function getTripById(tripId: string): Promise<Viaje> {
  return apiFetch<Viaje>(`/api/viajes/${tripId}`, { auth: true });
}

export async function deleteTrip(tripId: string): Promise<void> {
  const token = getToken();
  if (!token) throw new AuthError("No hay sesión activa", 401);

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/viajes/${tripId}`,
      {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    if (!response.ok) {
      const data = await response.json();
      throw new AuthError(data.mensaje || "Error al eliminar viaje", response.status);
    }
  } catch (error) {
    if (error instanceof AuthError) throw error;
    throw new AuthError("Error de conexión. Intenta de nuevo.");
  }
}

export async function getCommunityTrips(preferencia: string): Promise<ViajesResponse> {
  return apiFetch<ViajesResponse>(
    `/api/viajes/preferencia/${encodeURIComponent(preferencia)}`
  );
}
