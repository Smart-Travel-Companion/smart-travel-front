"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Loader2, Check, X } from "lucide-react";
import { toast } from "sonner";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { register, AuthError } from "@/lib/auth";
import { useAuth } from "@/providers/auth-provider";

const passwordRequirements = [
  { regex: /.{8,}/, label: "Al menos 8 caracteres" },
  { regex: /[A-Z]/, label: "Una letra mayúscula" },
  { regex: /[a-z]/, label: "Una letra minúscula" },
  { regex: /[0-9]/, label: "Un número" },
];

export function RegisterForm() {
  const router = useRouter();
  const { refreshUser } = useAuth();
  const [isLoading, setIsLoading] = React.useState(false);
  const [showPassword, setShowPassword] = React.useState(false);
  const [firstName, setFirstName] = React.useState("");
  const [lastName, setLastName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    // Validación local
    if (password !== confirmPassword) {
      toast.error("Las contraseñas no coinciden", {
        description: "Por favor, verifica que ambas contraseñas sean iguales.",
      });
      return;
    }

    // Validar requisitos de contraseña
    const allRequirementsMet = passwordRequirements.every((req) =>
      req.regex.test(password)
    );
    if (!allRequirementsMet) {
      toast.error("Contraseña inválida", {
        description: "La contraseña no cumple con los requisitos mínimos.",
      });
      return;
    }

    setIsLoading(true);

    try {
      await register({
        nombre: `${firstName} ${lastName}`.trim(),
        email,
        contraseña: password,
        contraseñaConfirm: confirmPassword,
      });

      await refreshUser();

      toast.success("¡Cuenta creada exitosamente!", {
        description: "Bienvenido a Smart Travel Companion.",
      });

      router.push("/onboarding");
    } catch (error) {
      if (error instanceof AuthError) {
        if (error.statusCode === 409 || error.message.toLowerCase().includes("existe")) {
          toast.error("Email ya registrado", {
            description: "Ya existe una cuenta con este correo electrónico.",
          });
        } else if (error.statusCode === 400) {
          toast.error("Datos inválidos", {
            description: error.message || "Por favor, revisa los datos ingresados.",
          });
        } else {
          toast.error("Error al crear cuenta", {
            description: error.message,
          });
        }
      } else {
        toast.error("Error de conexión", {
          description: "No se pudo conectar con el servidor. Intenta de nuevo.",
        });
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <form onSubmit={onSubmit} className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="firstName">Nombre</Label>
            <Input
              id="firstName"
              placeholder="Juan"
              autoComplete="given-name"
              disabled={isLoading}
              required
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="lastName">Apellido</Label>
            <Input
              id="lastName"
              placeholder="García"
              autoComplete="family-name"
              disabled={isLoading}
              required
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Correo electrónico</Label>
          <Input
            id="email"
            type="email"
            placeholder="tu@email.com"
            autoComplete="email"
            disabled={isLoading}
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Contraseña</Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              autoComplete="new-password"
              disabled={isLoading}
              required
              className="pr-10"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4 text-muted-foreground" />
              ) : (
                <Eye className="h-4 w-4 text-muted-foreground" />
              )}
              <span className="sr-only">
                {showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
              </span>
            </Button>
          </div>

          {/* Password requirements */}
          {password && (
            <div className="mt-3 space-y-2 rounded-lg border border-border/50 bg-muted/30 p-3">
              <p className="text-xs font-medium text-muted-foreground">
                La contraseña debe tener:
              </p>
              <ul className="space-y-1">
                {passwordRequirements.map((req) => {
                  const isValid = req.regex.test(password);
                  return (
                    <li
                      key={req.label}
                      className={cn(
                        "flex items-center gap-2 text-xs transition-colors",
                        isValid ? "text-emerald-600 dark:text-emerald-400" : "text-muted-foreground"
                      )}
                    >
                      {isValid ? (
                        <Check className="h-3 w-3" />
                      ) : (
                        <X className="h-3 w-3" />
                      )}
                      {req.label}
                    </li>
                  );
                })}
              </ul>
            </div>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirmPassword">Confirmar contraseña</Label>
          <Input
            id="confirmPassword"
            type="password"
            placeholder="••••••••"
            autoComplete="new-password"
            disabled={isLoading}
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          {confirmPassword && password !== confirmPassword && (
            <p className="text-xs text-destructive">Las contraseñas no coinciden</p>
          )}
        </div>

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Crear cuenta
        </Button>
      </form>

      <p className="text-center text-xs text-muted-foreground">
        Al crear una cuenta, aceptas nuestros{" "}
        <a href="/terms" className="underline underline-offset-4 hover:text-foreground">
          Términos de Servicio
        </a>{" "}
        y{" "}
        <a href="/privacy" className="underline underline-offset-4 hover:text-foreground">
          Política de Privacidad
        </a>
        .
      </p>
    </div>
  );
}
