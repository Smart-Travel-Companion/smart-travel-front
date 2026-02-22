import type { User } from "@/types";
import { apiFetch } from "./api-client";
import { saveUser } from "./token.service";

export async function updateUser(
  userId: string,
  data: Partial<Pick<User, "nombre" | "telefono" | "pais" | "ciudad" | "bio" | "foto">>
): Promise<User> {
  const responseData = await apiFetch<{ usuario?: User } & User>(
    `/api/users/${userId}`,
    {
      method: "PUT",
      auth: true,
      body: JSON.stringify(data),
    }
  );

  const user = responseData.usuario || responseData;
  saveUser(user as User);
  return user as User;
}

export async function updatePreferences(
  userId: string,
  preferencias: string[]
): Promise<string[]> {
  const data = await apiFetch<{ preferencias?: string[] }>(
    `/api/users/${userId}/preferencias`,
    {
      method: "PUT",
      auth: true,
      body: JSON.stringify({ preferencias }),
    }
  );

  return data.preferencias || preferencias;
}

export async function fetchAvailablePreferences(): Promise<string[]> {
  const data = await apiFetch<{ preferencias?: string[] }>("/api/preferencias");
  return data.preferencias || [];
}
