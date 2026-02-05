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
