import type { AuthResponse, LoginCredentials, RegisterData, User } from "@/types";
import { AuthError } from "@/types";
import { apiFetch } from "./api-client";
import { saveToken, saveUser, removeToken } from "./token.service";

export async function login(credentials: LoginCredentials): Promise<AuthResponse> {
  const data = await apiFetch<AuthResponse>("/api/auth/login", {
    method: "POST",
    body: JSON.stringify(credentials),
  });

  saveToken(data.token);
  saveUser(data.usuario);

  return data;
}

export async function register(data: RegisterData): Promise<AuthResponse> {
  const responseData = await apiFetch<AuthResponse>("/api/auth/registrar", {
    method: "POST",
    body: JSON.stringify(data),
  });

  saveToken(responseData.token);
  saveUser(responseData.usuario);

  return responseData;
}

export async function fetchProfile(): Promise<User> {
  try {
    const data = await apiFetch<{ usuario?: User } & User>("/api/auth/perfil", {
      auth: true,
    });

    const user = data.usuario || data;
    saveUser(user as User);
    return user as User;
  } catch (error) {
    if (error instanceof AuthError && error.statusCode === 401) {
      removeToken();
    }
    throw error;
  }
}
