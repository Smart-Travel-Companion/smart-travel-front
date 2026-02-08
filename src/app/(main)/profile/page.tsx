"use client";

import * as React from "react";
import Link from "next/link";
import {
  User,
  Mail,
  MapPin,
  Phone,
  Calendar,
  Edit3,
  Save,
  X,
  Loader2,
  Globe,
  FileText,
  Compass,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Header, Footer } from "@/components/layout";
import { AuthGuard } from "@/components/layout/auth-guard";
import { useAuth } from "@/providers/auth-provider";
import { updateUser } from "@/lib/auth";

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

function formatDate(dateStr?: string): string {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("es-ES", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function getDaysSinceJoined(dateStr?: string): number {
  if (!dateStr) return 0;
  const diff = Date.now() - new Date(dateStr).getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24));
}

export default function ProfilePage() {
  const { user, refreshUser } = useAuth();
  const [isEditing, setIsEditing] = React.useState(false);
  const [isSaving, setIsSaving] = React.useState(false);

  const [formData, setFormData] = React.useState({
    nombre: "",
    telefono: "",
    pais: "",
    ciudad: "",
    bio: "",
  });

  React.useEffect(() => {
    if (user) {
      setFormData({
        nombre: user.nombre || "",
        telefono: user.telefono || "",
        pais: user.pais || "",
        ciudad: user.ciudad || "",
        bio: user.bio || "",
      });
    }
  }, [user]);

  function handleCancel() {
    if (user) {
      setFormData({
        nombre: user.nombre || "",
        telefono: user.telefono || "",
        pais: user.pais || "",
        ciudad: user.ciudad || "",
        bio: user.bio || "",
      });
    }
    setIsEditing(false);
  }

  async function handleSave() {
    if (!user?._id) return;
    setIsSaving(true);
    try {
      await updateUser(user._id, formData);
      await refreshUser();
      setIsEditing(false);

      toast.success("Perfil actualizado", {
        description: "Tus datos se han guardado correctamente.",
      });
    } catch {
      toast.error("Error al guardar", {
        description: "No se pudo actualizar el perfil. Intenta de nuevo.",
      });
    } finally {
      setIsSaving(false);
    }
  }

  const completionItems = [
    { done: !!user?.nombre, label: "Nombre" },
    { done: !!user?.pais, label: "País" },
    { done: !!user?.ciudad, label: "Ciudad" },
    { done: !!user?.telefono, label: "Teléfono" },
    { done: !!user?.bio, label: "Bio" },
    { done: (user?.preferencias?.length || 0) > 0, label: "Preferencias" },
  ];
  const completedCount = completionItems.filter((i) => i.done).length;
  const completionPercent = Math.round(
    (completedCount / completionItems.length) * 100
  );

  return (
    <AuthGuard>
      <div className="flex min-h-screen flex-col">
        <Header />

        <main className="flex-1">
          {/* Hero Banner */}
          <div className="relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent" />
            <div className="container relative mx-auto max-w-5xl px-4 pb-20 pt-10 md:px-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
                    Mi Perfil
                  </h1>
                  <p className="text-muted-foreground">
                    Gestiona tu información personal y preferencias
                  </p>
                </div>
                {!isEditing ? (
                  <Button
                    variant="outline"
                    className="gap-2 bg-background/80 backdrop-blur-sm"
                    onClick={() => setIsEditing(true)}
                  >
                    <Edit3 className="h-4 w-4" />
                    Editar perfil
                  </Button>
                ) : (
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleCancel}
                      disabled={isSaving}
                      className="gap-1 bg-background/80"
                    >
                      <X className="h-4 w-4" />
                      Cancelar
                    </Button>
                    <Button
                      size="sm"
                      className="gap-2"
                      onClick={handleSave}
                      disabled={isSaving}
                    >
                      {isSaving ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Save className="h-4 w-4" />
                      )}
                      Guardar cambios
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="container mx-auto max-w-5xl px-4 md:px-6">
            {/* Profile Card - overlapping the banner */}
            <div className="-mt-12 mb-8">
              <Card className="overflow-hidden">
                <CardContent className="p-0">
                  <div className="flex flex-col items-center gap-6 p-6 sm:flex-row sm:items-start">
                    {/* Avatar */}
                    <div className="relative">
                      <Avatar className="h-28 w-28 border-4 border-background shadow-lg">
                        <AvatarFallback className="bg-primary text-3xl font-bold text-primary-foreground">
                          {user ? getInitials(user.nombre) : "?"}
                        </AvatarFallback>
                      </Avatar>
                      <div className="absolute -bottom-1 -right-1 flex h-8 w-8 items-center justify-center rounded-full border-2 border-background bg-emerald-500 text-white">
                        <Sparkles className="h-4 w-4" />
                      </div>
                    </div>

                    {/* Info */}
                    <div className="flex-1 text-center sm:text-left">
                      <h2 className="text-xl font-bold md:text-2xl">
                        {user?.nombre || "—"}
                      </h2>
                      <p className="mt-0.5 text-sm text-muted-foreground">
                        {user?.email}
                      </p>

                      <div className="mt-3 flex flex-wrap items-center justify-center gap-3 sm:justify-start">
                        {(user?.ciudad || user?.pais) && (
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <MapPin className="h-3.5 w-3.5" />
                            {[user?.ciudad, user?.pais]
                              .filter(Boolean)
                              .join(", ")}
                          </div>
                        )}
                        {user?.telefono && (
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <Phone className="h-3.5 w-3.5" />
                            {user.telefono}
                          </div>
                        )}
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Calendar className="h-3.5 w-3.5" />
                          {formatDate(user?.createdAt)}
                        </div>
                      </div>

                      {user?.bio && (
                        <p className="mt-3 max-w-lg text-sm text-muted-foreground">
                          {user.bio}
                        </p>
                      )}
                    </div>

                    {/* Stats */}
                    <div className="flex gap-6 sm:gap-8">
                      <div className="text-center">
                        <p className="text-2xl font-bold">
                          {user?.preferencias?.length || 0}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Preferencias
                        </p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold">
                          {getDaysSinceJoined(user?.createdAt)}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Días como miembro
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Content Grid */}
            <div className="grid gap-6 pb-10 lg:grid-cols-3">
              {/* Left Column */}
              <div className="space-y-6 lg:col-span-2">
                {/* Personal Info */}
                <Card>
                  <CardHeader className="pb-4">
                    <CardTitle className="flex items-center gap-2 text-base">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                        <User className="h-4 w-4 text-primary" />
                      </div>
                      Información personal
                    </CardTitle>
                    <CardDescription>
                      Datos de tu cuenta en Smart Travel
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-5">
                    <div className="grid gap-5 sm:grid-cols-2">
                      <div className="space-y-1.5">
                        <Label
                          htmlFor="nombre"
                          className="text-xs font-medium uppercase tracking-wider text-muted-foreground"
                        >
                          Nombre completo
                        </Label>
                        {isEditing ? (
                          <Input
                            id="nombre"
                            value={formData.nombre}
                            onChange={(e) =>
                              setFormData((p) => ({
                                ...p,
                                nombre: e.target.value,
                              }))
                            }
                          />
                        ) : (
                          <p className="text-sm font-medium">
                            {user?.nombre || "—"}
                          </p>
                        )}
                      </div>
                      <div className="space-y-1.5">
                        <Label className="flex items-center gap-1 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                          <Mail className="h-3 w-3" /> Email
                        </Label>
                        <p className="text-sm font-medium">
                          {user?.email || "—"}
                        </p>
                      </div>
                    </div>

                    <Separator />

                    <div className="grid gap-5 sm:grid-cols-2">
                      <div className="space-y-1.5">
                        <Label className="flex items-center gap-1 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                          <Phone className="h-3 w-3" /> Teléfono
                        </Label>
                        {isEditing ? (
                          <Input
                            value={formData.telefono}
                            onChange={(e) =>
                              setFormData((p) => ({
                                ...p,
                                telefono: e.target.value,
                              }))
                            }
                            placeholder="+51 999 999 999"
                          />
                        ) : (
                          <p className="text-sm font-medium">
                            {user?.telefono || (
                              <span className="text-muted-foreground">
                                Sin registrar
                              </span>
                            )}
                          </p>
                        )}
                      </div>
                      <div className="space-y-1.5">
                        <Label className="flex items-center gap-1 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                          <Globe className="h-3 w-3" /> Ubicación
                        </Label>
                        {isEditing ? (
                          <div className="grid grid-cols-2 gap-2">
                            <Input
                              value={formData.ciudad}
                              onChange={(e) =>
                                setFormData((p) => ({
                                  ...p,
                                  ciudad: e.target.value,
                                }))
                              }
                              placeholder="Ciudad"
                            />
                            <Input
                              value={formData.pais}
                              onChange={(e) =>
                                setFormData((p) => ({
                                  ...p,
                                  pais: e.target.value,
                                }))
                              }
                              placeholder="País"
                            />
                          </div>
                        ) : (
                          <p className="text-sm font-medium">
                            {user?.ciudad || user?.pais ? (
                              [user?.ciudad, user?.pais]
                                .filter(Boolean)
                                .join(", ")
                            ) : (
                              <span className="text-muted-foreground">
                                Sin registrar
                              </span>
                            )}
                          </p>
                        )}
                      </div>
                    </div>

                    <Separator />

                    <div className="space-y-1.5">
                      <Label className="flex items-center gap-1 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                        <FileText className="h-3 w-3" /> Bio
                      </Label>
                      {isEditing ? (
                        <textarea
                          className="flex min-h-24 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                          value={formData.bio}
                          onChange={(e) =>
                            setFormData((p) => ({
                              ...p,
                              bio: e.target.value,
                            }))
                          }
                          placeholder="Cuéntanos algo sobre ti y tus viajes..."
                          maxLength={500}
                        />
                      ) : (
                        <p className="text-sm leading-relaxed">
                          {user?.bio || (
                            <span className="text-muted-foreground">
                              Aún no has agregado una bio. Edita tu perfil para
                              compartir algo sobre ti.
                            </span>
                          )}
                        </p>
                      )}
                      {isEditing && (
                        <p className="text-right text-xs text-muted-foreground">
                          {formData.bio.length}/500
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Preferences */}
                <Card>
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                          <Compass className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <CardTitle className="text-base">
                            Preferencias de viaje
                          </CardTitle>
                          <CardDescription>
                            Lo que define tu estilo de viajero
                          </CardDescription>
                        </div>
                      </div>
                      <Link href="/onboarding">
                        <Button variant="ghost" size="sm" className="text-xs">
                          <Edit3 className="mr-1 h-3 w-3" />
                          Modificar
                        </Button>
                      </Link>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {user?.preferencias && user.preferencias.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {user.preferencias.map((pref) => (
                          <Badge
                            key={pref}
                            variant="secondary"
                            className="rounded-full px-3 py-1 capitalize"
                          >
                            {pref}
                          </Badge>
                        ))}
                      </div>
                    ) : (
                      <div className="flex flex-col items-center gap-3 rounded-lg border border-dashed py-8 text-center">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                          <Compass className="h-6 w-6 text-muted-foreground" />
                        </div>
                        <div>
                          <p className="font-medium">
                            Sin preferencias configuradas
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Configura tus preferencias para obtener
                            recomendaciones personalizadas
                          </p>
                        </div>
                        <Link href="/onboarding">
                          <Button size="sm" className="mt-1 gap-2">
                            <Sparkles className="h-4 w-4" />
                            Configurar ahora
                          </Button>
                        </Link>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Right Column - Sidebar */}
              <div className="space-y-6">
                {/* Profile Completion */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium">
                      Perfil completado
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Progress ring */}
                    <div className="flex items-center gap-4">
                      <div className="relative h-16 w-16">
                        <svg
                          className="h-16 w-16 -rotate-90"
                          viewBox="0 0 36 36"
                        >
                          <path
                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="3"
                            className="text-muted/50"
                          />
                          <path
                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="3"
                            strokeDasharray={`${completionPercent}, 100`}
                            strokeLinecap="round"
                            className="text-primary transition-all duration-500"
                          />
                        </svg>
                        <span className="absolute inset-0 flex items-center justify-center text-sm font-bold">
                          {completionPercent}%
                        </span>
                      </div>
                      <div>
                        <p className="text-sm font-medium">
                          {completedCount} de {completionItems.length} campos
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {completionPercent === 100
                            ? "Perfil completo"
                            : "Completa tu perfil"}
                        </p>
                      </div>
                    </div>

                    <Separator />

                    {/* Checklist */}
                    <div className="space-y-2">
                      {completionItems.map((item) => (
                        <div
                          key={item.label}
                          className="flex items-center gap-2 text-sm"
                        >
                          <div
                            className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${
                              item.done
                                ? "bg-emerald-500/10 text-emerald-500"
                                : "bg-muted text-muted-foreground"
                            }`}
                          >
                            {item.done ? (
                              <svg
                                className="h-3 w-3"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth="3"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M4.5 12.75l6 6 9-13.5"
                                />
                              </svg>
                            ) : (
                              <div className="h-1.5 w-1.5 rounded-full bg-current" />
                            )}
                          </div>
                          <span
                            className={
                              item.done ? "text-foreground" : "text-muted-foreground"
                            }
                          >
                            {item.label}
                          </span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Quick Actions */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium">
                      Acciones rápidas
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <Link href="/dashboard" className="block">
                      <Button
                        variant="ghost"
                        className="w-full justify-start gap-2 text-sm"
                      >
                        <Sparkles className="h-4 w-4" />
                        Ir al Dashboard
                      </Button>
                    </Link>
                    <Link href="/onboarding" className="block">
                      <Button
                        variant="ghost"
                        className="w-full justify-start gap-2 text-sm"
                      >
                        <Compass className="h-4 w-4" />
                        Reconfigurar preferencias
                      </Button>
                    </Link>
                    <Button
                      variant="ghost"
                      className="w-full justify-start gap-2 text-sm"
                      onClick={() => setIsEditing(true)}
                    >
                      <Edit3 className="h-4 w-4" />
                      Editar información
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </AuthGuard>
  );
}
