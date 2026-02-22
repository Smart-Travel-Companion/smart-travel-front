"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  MapPin,
  Sparkles,
  ArrowRight,
  Globe,
  User,
  Map,
  Users,
  BookmarkCheck,
  ImageOff,
  Loader2,
  Compass,
  Layers,
  Calendar,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Header, Footer } from "@/components/layout";
import { AuthGuard } from "@/components/layout/auth-guard";
import { useAuth } from "@/providers/auth-provider";
import { getMyTrips, type Viaje } from "@/lib/auth";

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
  if (hour < 12) return "Buenos dias";
  if (hour < 18) return "Buenas tardes";
  return "Buenas noches";
}

export default function DashboardPage() {
  const { user } = useAuth();
  const [trips, setTrips] = useState<Viaje[]>([]);
  const [isLoadingTrips, setIsLoadingTrips] = useState(true);

  const firstName = user?.nombre?.split(" ")[0] || "Viajero";
  const hasPreferences = user?.preferencias && user.preferencias.length > 0;
  const hasProfile = user?.pais || user?.ciudad;

  useEffect(() => {
    getMyTrips()
      .then((data) => setTrips(data.viajes || []))
      .catch(() => setTrips([]))
      .finally(() => setIsLoadingTrips(false));
  }, []);

  const savedTrips = trips.filter((t) => t.estado === "guardada");
  const uniqueDestinations = new Set(
    trips.map((t) => t.ubicacion?.city).filter(Boolean)
  ).size;
  const totalPlaces = trips.reduce(
    (acc, t) => acc + (Array.isArray(t.places) ? t.places.length : 0),
    0
  );
  const recentTrips = [...trips]
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
    .slice(0, 6);

  function formatDate(dateStr: string) {
    return new Date(dateStr).toLocaleDateString("es-ES", {
      day: "numeric",
      month: "short",
    });
  }

  function getTripImage(trip: Viaje): string | null {
    if (trip.places && Array.isArray(trip.places) && trip.places.length > 0) {
      return trip.places[0].image_url || null;
    }
    return null;
  }

  return (
    <AuthGuard>
      <div className="flex min-h-screen flex-col">
        <Header />

        <main className="flex-1 bg-muted/30">
          {/* Hero */}
          <div className="border-b bg-background">
            <div className="container mx-auto max-w-6xl px-4 py-8 md:px-6">
              <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-4">
                  <Avatar className="h-12 w-12 shadow-md sm:h-14 sm:w-14">
                    <AvatarFallback className="bg-primary text-base font-bold text-primary-foreground sm:text-lg">
                      {user ? getInitials(user.nombre) : "?"}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-xs text-muted-foreground">{getGreeting()}</p>
                    <h1 className="text-lg font-bold sm:text-xl">{firstName}</h1>
                    {hasProfile && (
                      <p className="flex items-center gap-1 text-xs text-muted-foreground">
                        <MapPin className="h-3 w-3" />
                        {[user?.ciudad, user?.pais].filter(Boolean).join(", ")}
                      </p>
                    )}
                  </div>
                </div>
                <Link href="/explore">
                  <Button className="gap-2 cursor-pointer">
                    <Sparkles className="h-4 w-4" />
                    Nueva exploracion
                  </Button>
                </Link>
              </div>

              {/* KPI Indicators */}
              <div className="mt-6 grid grid-cols-2 gap-3 border-t pt-5 sm:grid-cols-4">
                {[
                  { label: "Viajes", value: trips.length, icon: Map, color: "text-blue-600", bg: "bg-blue-50 dark:bg-blue-950/30" },
                  { label: "Guardados", value: savedTrips.length, icon: BookmarkCheck, color: "text-emerald-600", bg: "bg-emerald-50 dark:bg-emerald-950/30" },
                  { label: "Destinos", value: uniqueDestinations, icon: Globe, color: "text-violet-600", bg: "bg-violet-50 dark:bg-violet-950/30" },
                  { label: "Lugares", value: totalPlaces, icon: MapPin, color: "text-amber-600", bg: "bg-amber-50 dark:bg-amber-950/30" },
                ].map((s) => {
                  const Icon = s.icon;
                  return (
                    <Card key={s.label}>
                      <CardContent className="flex items-center gap-3 p-4">
                        <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${s.bg}`}>
                          <Icon className={`h-5 w-5 ${s.color}`} />
                        </div>
                        <div>
                          {isLoadingTrips ? (
                            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                          ) : (
                            <p className={`text-2xl font-bold tabular-nums leading-none ${s.color}`}>{s.value}</p>
                          )}
                          <p className="mt-1 text-xs text-muted-foreground">{s.label}</p>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="container mx-auto max-w-6xl px-4 py-6 md:px-6">
            {/* Navigation */}
            <div className="mb-6 flex gap-2 overflow-x-auto">
              {[
                { icon: Map, label: "Explorar", href: "/explore" },
                { icon: BookmarkCheck, label: "Mis viajes", href: "/my-trips" },
                { icon: Users, label: "Comunidad", href: "/community" },
                { icon: User, label: "Perfil", href: "/profile" },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <Link key={item.label} href={item.href}>
                    <Button variant="outline" size="sm" className="gap-2 cursor-pointer whitespace-nowrap">
                      <Icon className="h-4 w-4" />
                      {item.label}
                    </Button>
                  </Link>
                );
              })}
            </div>

            {/* Recent Trips */}
            <div className="mb-8">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-sm font-semibold">Viajes recientes</h2>
                {recentTrips.length > 0 && (
                  <Link href="/my-trips">
                    <Button variant="ghost" size="sm" className="gap-1 text-xs cursor-pointer text-muted-foreground">
                      Ver todos <ArrowRight className="h-3.5 w-3.5" />
                    </Button>
                  </Link>
                )}
              </div>

              {isLoadingTrips ? (
                <div className="flex items-center justify-center py-20">
                  <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                </div>
              ) : recentTrips.length === 0 ? (
                <Card className="border-dashed">
                  <CardContent className="flex flex-col items-center gap-4 py-16 text-center">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                      <Map className="h-8 w-8 text-muted-foreground/30" />
                    </div>
                    <div>
                      <p className="font-medium">Sin viajes todavia</p>
                      <p className="mt-1 max-w-xs text-sm text-muted-foreground">
                        Explora un destino con inteligencia artificial y tus viajes apareceran aqui.
                      </p>
                    </div>
                    <Link href="/explore">
                      <Button className="gap-2 cursor-pointer">
                        <Sparkles className="h-4 w-4" />
                        Explorar destinos
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {recentTrips.map((trip) => {
                    const city = trip.ubicacion?.city || "Sin ciudad";
                    const placesCount = Array.isArray(trip.places) ? trip.places.length : 0;
                    const img = getTripImage(trip);

                    return (
                      <Link key={trip._id} href={`/explore?tripId=${trip._id}`}>
                        <Card className="group h-full cursor-pointer overflow-hidden transition-all hover:shadow-lg hover:border-primary/20">
                          <div className="relative h-36 bg-muted">
                            {img ? (
                              <Image
                                src={img}
                                alt={city}
                                fill
                                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                className="object-cover transition-transform duration-300 group-hover:scale-105"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).style.display = "none";
                                }}
                              />
                            ) : (
                              <div className="flex h-full items-center justify-center">
                                <ImageOff className="h-8 w-8 text-muted-foreground/15" />
                              </div>
                            )}
                            <div className="absolute inset-0 bg-linear-to-t from-black/50 to-transparent" />
                            <Badge
                              variant={trip.estado === "guardada" ? "default" : "secondary"}
                              className="absolute right-2 top-2 rounded-full text-[10px] backdrop-blur-sm"
                            >
                              {trip.estado === "guardada" ? "Guardado" : "Generado"}
                            </Badge>
                            <div className="absolute bottom-2.5 left-3">
                              <p className="text-sm font-bold text-white drop-shadow-md">{city}</p>
                            </div>
                          </div>
                          <CardContent className="flex items-center justify-between p-3 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Layers className="h-3 w-3" /> {placesCount} lugares
                            </span>
                            <span className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" /> {formatDate(trip.createdAt)}
                            </span>
                          </CardContent>
                        </Card>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Bottom row */}
            <div className="grid gap-4 sm:grid-cols-2">
              {/* Preferences */}
              {hasPreferences ? (
                <Card>
                  <CardContent className="p-5">
                    <div className="mb-3 flex items-center justify-between">
                      <h3 className="flex items-center gap-2 text-sm font-semibold">
                        <Compass className="h-4 w-4 text-primary" />
                        Tus preferencias
                      </h3>
                      <Link href="/onboarding">
                        <Button variant="ghost" size="sm" className="h-auto p-0 text-xs text-muted-foreground cursor-pointer">
                          Editar
                        </Button>
                      </Link>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {user?.preferencias?.map((pref) => (
                        <Badge key={pref} variant="secondary" className="rounded-full text-xs capitalize">
                          {pref}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card className="border-dashed">
                  <CardContent className="flex items-center gap-4 p-5">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary/10">
                      <Compass className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Configura tus preferencias</p>
                      <p className="text-xs text-muted-foreground">Mejores recomendaciones para ti</p>
                    </div>
                    <Link href="/onboarding">
                      <Button size="sm" className="gap-1.5 cursor-pointer">
                        <Sparkles className="h-3.5 w-3.5" /> Comenzar
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              )}

              {/* Community */}
              <Card>
                <CardContent className="flex items-center gap-4 p-5">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-violet-500/10">
                    <Users className="h-5 w-5 text-violet-500" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Comunidad viajera</p>
                    <p className="text-xs text-muted-foreground">Descubre viajes de otros usuarios</p>
                  </div>
                  <Link href="/community">
                    <Button variant="outline" size="sm" className="gap-1.5 cursor-pointer">
                      <Globe className="h-3.5 w-3.5" /> Explorar
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </AuthGuard>
  );
}
