import type { Metadata } from "next";
import Link from "next/link";
import { RegisterForm } from "@/components/forms/register-form";

export const metadata: Metadata = {
  title: "Crear Cuenta",
  description: "Crea tu cuenta en Smart Travel Companion",
};

export default function RegisterPage() {
  return (
    <div className="w-full max-w-md space-y-8">
      {/* Header */}
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-bold tracking-tight">Crea tu cuenta</h1>
        <p className="text-muted-foreground">
          Únete a Smart Travel y comienza a planificar viajes increíbles
        </p>
      </div>

      {/* Form */}
      <RegisterForm />

      {/* Footer */}
      <p className="text-center text-sm text-muted-foreground">
        ¿Ya tienes una cuenta?{" "}
        <Link
          href="/login"
          className="font-medium text-foreground underline-offset-4 hover:underline"
        >
          Inicia sesión
        </Link>
      </p>
    </div>
  );
}
