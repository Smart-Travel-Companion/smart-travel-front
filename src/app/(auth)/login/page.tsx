import type { Metadata } from "next";
import Link from "next/link";
import { LoginForm } from "@/components/forms/login-form";

export const metadata: Metadata = {
  title: "Iniciar Sesión",
  description: "Accede a tu cuenta de Smart Travel Companion",
};

export default function LoginPage() {
  return (
    <div className="w-full max-w-md space-y-8">
      {/* Header */}
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-bold tracking-tight">Bienvenido de vuelta</h1>
        <p className="text-muted-foreground">
          Ingresa tus credenciales para acceder a tu cuenta
        </p>
      </div>

      {/* Form */}
      <LoginForm />

      {/* Footer */}
      <p className="text-center text-sm text-muted-foreground">
        ¿No tienes una cuenta?{" "}
        <Link
          href="/register"
          className="font-medium text-foreground underline-offset-4 hover:underline"
        >
          Regístrate aquí
        </Link>
      </p>
    </div>
  );
}
