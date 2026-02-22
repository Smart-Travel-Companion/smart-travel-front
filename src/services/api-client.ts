import { AuthError } from "@/types";
import { getToken, removeToken } from "./token.service";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

interface ApiFetchOptions extends Omit<RequestInit, "headers"> {
  auth?: boolean;
  headers?: Record<string, string>;
}

export async function apiFetch<T>(
  endpoint: string,
  options?: ApiFetchOptions
): Promise<T> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...options?.headers,
  };

  if (options?.auth) {
    const token = getToken();
    if (!token) throw new AuthError("No hay sesión activa", 401);
    headers["Authorization"] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers,
    });

    // Handle no-content responses (e.g. DELETE)
    if (response.status === 204) {
      return undefined as T;
    }

    const data = await response.json();

    if (!response.ok) {
      if (response.status === 401) {
        removeToken();
      }
      throw new AuthError(
        data.mensaje || data.message || "Error en la solicitud",
        response.status
      );
    }

    return data;
  } catch (error) {
    if (error instanceof AuthError) throw error;
    throw new AuthError("Error de conexión. Intenta de nuevo.");
  }
}
