"use client";

import Link from "next/link";
import {
  MapPin,
  Calendar,
  Compass,
  Sparkles,
  ArrowRight,
  Globe,
  TrendingUp,
  Clock,
  User,
  Map,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Header, Footer } from "@/components/layout";
import { AuthGuard } from "@/components/layout/auth-guard";
import { useAuth } from "@/providers/auth-provider";

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Buenos días";
  if (hour < 18) return "Buenas tardes";
  return "Buenas noches";
}

const quickActions = [
  {
    icon: Map,
    title: "Explorar destinos",
    description: "Descubre nuevos lugares",
    color: "bg-blue-500/10 text-blue-500",
    href: "/explore",
  },
  {
    icon: Calendar,
    title: "Crear itinerario",
    description: "Planifica tu viaje",
    color: "bg-amber-500/10 text-amber-500",
    href: "/dashboard",
  },
  {
    icon: Sparkles,
    title: "Recomendaciones IA",
    description: "Sugerencias personalizadas",
    color: "bg-violet-500/10 text-violet-500",
    href: "/explore",
  },
  {
    icon: User,
    title: "Mi perfil",
    description: "Gestiona tu cuenta",
    color: "bg-emerald-500/10 text-emerald-500",
    href: "/profile",
  },
];

const trendingDestinations = [
  { name: "Cusco", country: "Perú", tag: "Cultural" },
  { name: "Cancún", country: "México", tag: "Playa" },
  { name: "Buenos Aires", country: "Argentina", tag: "Gastronomía" },
  { name: "Cartagena", country: "Colombia", tag: "Histórico" },
];

export default function DashboardPage() {
  const { user } = useAuth();

  const firstName = user?.nombre?.split(" ")[0] || "Viajero";
  const hasPreferences =
    user?.preferencias && user.preferencias.length > 0;
  const hasProfile = user?.pais || user?.ciudad;

  return (
    <AuthGuard>
      <div className="flex min-h-screen flex-col">
        <Header />

        <main className="flex-1">
          {/* Welcome Hero */}
          <div className="relative overflow-hidden border-b">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,var(--tw-gradient-stops))] from-primary/8 via-transparent to-transparent" />
            <div className="container relative mx-auto max-w-6xl px-4 py-10 md:px-6">
              <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-4">
                  <Avatar className="h-16 w-16 border-2 border-primary/20 shadow-lg">
                    <AvatarFallback className="bg-primary text-xl font-bold text-primary-foreground">
                      {user ? getInitials(user.nombre) : "?"}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      {getGreeting()}
                    </p>
                    <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
                      {firstName}
                    </h1>
                    {hasProfile && (
                      <div className="mt-1 flex items-center gap-1 text-sm text-muted-foreground">
                        <MapPin className="h-3.5 w-3.5" />
                        {[user?.ciudad, user?.pais]
                          .filter(Boolean)
                          .join(", ")}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex gap-3">
                  <Link href="/profile">
                    <Button variant="outline" size="sm" className="gap-2">
                      <User className="h-4 w-4" />
                      Ver perfil
                    </Button>
                  </Link>
                  <Link href="/onboarding">
                    <Button size="sm" className="gap-2">
                      <Sparkles className="h-4 w-4" />
                      {hasPreferences ? "Mis preferencias" : "Configurar perfil"}
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>

          <div className="container mx-auto max-w-6xl px-4 py-8 md:px-6">
            {/* Stats Row */}
            <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <Card className="relative overflow-hidden">
                <CardContent className="p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                        Preferencias
                      </p>
                      <p className="mt-1 text-2xl font-bold">
                        {user?.preferencias?.length || 0}
                      </p>
                    </div>
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-violet-500/10">
                      <Sparkles className="h-5 w-5 text-violet-500" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="relative overflow-hidden">
                <CardContent className="p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                        Viajes
                      </p>
                      <p className="mt-1 text-2xl font-bold">0</p>
                    </div>
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10">
                      <Globe className="h-5 w-5 text-blue-500" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="relative overflow-hidden">
                <CardContent className="p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                        Destinos
                      </p>
                      <p className="mt-1 text-2xl font-bold">0</p>
                    </div>
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/10">
                      <MapPin className="h-5 w-5 text-emerald-500" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="relative overflow-hidden">
                <CardContent className="p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                        Itinerarios
                      </p>
                      <p className="mt-1 text-2xl font-bold">0</p>
                    </div>
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-500/10">
                      <Calendar className="h-5 w-5 text-amber-500" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid gap-8 lg:grid-cols-3">
              {/* Main Content */}
              <div className="space-y-8 lg:col-span-2">
                {/* Quick Actions */}
                <div>
                  <h2 className="mb-4 text-lg font-semibold">
                    Acciones rápidas
                  </h2>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {quickActions.map((action) => {
                      const Icon = action.icon;
                      return (
                        <Link key={action.title} href={action.href}>
                          <Card className="group h-full transition-all hover:border-primary/30 hover:shadow-md">
                            <CardContent className="flex items-center gap-4 p-4">
                              <div
                                className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${action.color}`}
                              >
                                <Icon className="h-6 w-6" />
                              </div>
                              <div className="flex-1">
                                <p className="font-medium">{action.title}</p>
                                <p className="text-xs text-muted-foreground">
                                  {action.description}
                                </p>
                              </div>
                              <ArrowRight className="h-4 w-4 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
                            </CardContent>
                          </Card>
                        </Link>
                      );
                    })}
                  </div>
                </div>

                {/* Trending Destinations */}
                <Card>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                          <TrendingUp className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <CardTitle className="text-base">
                            Destinos populares
                          </CardTitle>
                          <CardDescription>
                            Los más buscados esta semana
                          </CardDescription>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {trendingDestinations.map((dest, i) => (
                        <Link
                          key={dest.name}
                          href={`/explore?city=${encodeURIComponent(dest.name)}`}
                          className="flex items-center gap-4 rounded-lg p-3 transition-colors hover:bg-muted/50"
                        >
                          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted text-sm font-semibold text-muted-foreground">
                            {i + 1}
                          </span>
                          <div className="flex-1">
                            <p className="text-sm font-medium">{dest.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {dest.country}
                            </p>
                          </div>
                          <Badge
                            variant="secondary"
                            className="rounded-full text-xs"
                          >
                            {dest.tag}
                          </Badge>
                        </Link>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Preferences Card */}
                {hasPreferences ? (
                  <Card>
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="flex items-center gap-2 text-sm font-medium">
                          <Compass className="h-4 w-4 text-primary" />
                          Tus preferencias
                        </CardTitle>
                        <Link href="/onboarding">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-auto p-0 text-xs text-muted-foreground hover:text-foreground"
                          >
                            Editar
                          </Button>
                        </Link>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-1.5">
                        {user?.preferencias?.map((pref) => (
                          <Badge
                            key={pref}
                            variant="secondary"
                            className="rounded-full capitalize"
                          >
                            {pref}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  <Card className="border-dashed">
                    <CardContent className="flex flex-col items-center gap-3 p-6 text-center">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                        <Compass className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">Configura tu perfil</p>
                        <p className="text-xs text-muted-foreground">
                          Personaliza tus preferencias para mejores
                          recomendaciones
                        </p>
                      </div>
                      <Link href="/onboarding">
                        <Button size="sm" className="mt-1 gap-2">
                          <Sparkles className="h-4 w-4" />
                          Comenzar
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                )}

                {/* Recent Activity */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-sm font-medium">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      Actividad reciente
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-col items-center gap-2 py-4 text-center">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                        <Clock className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Tu actividad aparecerá aquí
                      </p>
                    </div>
                  </CardContent>
                </Card>

                {/* Tip Card */}
                <Card className="border-primary/20 bg-primary/5">
                  <CardContent className="p-5">
                    <div className="flex gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                        <Sparkles className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">Consejo del día</p>
                        <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                          Completa tu perfil con preferencias y ubicación para
                          que la IA pueda darte recomendaciones más precisas y
                          personalizadas.
                        </p>
                      </div>
                    </div>
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
