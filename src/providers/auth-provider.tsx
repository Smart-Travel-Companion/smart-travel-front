"use client";

import * as React from "react";
import {
  getToken,
  getUser,
  fetchProfile,
  logout as authLogout,
  type User,
} from "@/lib/auth";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  refreshUser: () => Promise<void>;
  logout: () => void;
}

const AuthContext = React.createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  refreshUser: async () => {},
  logout: () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = React.useState<User | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);

  const refreshUser = React.useCallback(async () => {
    const token = getToken();
    if (!token) {
      setUser(null);
      setIsLoading(false);
      return;
    }

    try {
      const profile = await fetchProfile();
      setUser(profile);
    } catch {
      // Token inválido o expirado
      setUser(null);
      authLogout();
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = React.useCallback(() => {
    authLogout();
    setUser(null);
  }, []);

  // Al montar, verificar sesión
  React.useEffect(() => {
    // Primero intentar cargar del localStorage para respuesta instantánea
    const cachedUser = getUser();
    if (cachedUser) {
      setUser(cachedUser);
      setIsLoading(false);
      // Luego refrescar en background para validar token
      fetchProfile()
        .then(setUser)
        .catch(() => {
          setUser(null);
          authLogout();
        });
    } else {
      refreshUser();
    }
  }, [refreshUser]);

  // Escuchar cambios en localStorage (para múltiples tabs)
  React.useEffect(() => {
    function handleStorageChange(e: StorageEvent) {
      if (e.key === "auth_token") {
        if (!e.newValue) {
          setUser(null);
        } else {
          refreshUser();
        }
      }
    }
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [refreshUser]);

  const value = React.useMemo(
    () => ({
      user,
      isAuthenticated: !!user,
      isLoading,
      refreshUser,
      logout,
    }),
    [user, isLoading, refreshUser, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
