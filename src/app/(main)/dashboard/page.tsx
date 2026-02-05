import type { Metadata } from "next";
import Link from "next/link";
import { Compass, MapPin, Calendar, Settings, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ThemeToggle } from "@/components/ui/theme-toggle";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Tu panel de control de Smart Travel Companion",
};

// Datos mock del usuario
const mockUser = {
  name: "Juan García",
  email: "juan@email.com",
  initials: "JG",
  preferences: {
    travelStyles: ["Aventura", "Cultural"],
    budget: "Moderado",
    interests: ["Fotografía", "Historia", "Gastronomía"],
  },
};

// Estadísticas mock
const stats = [
  { label: "Viajes planificados", value: "3" },
  { label: "Destinos guardados", value: "12" },
  { label: "Días de aventura", value: "45" },
];

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border/40 bg-background/80 backdrop-blur-lg">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
              <Compass className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="font-semibold">Smart Travel</span>
          </Link>

          <div className="flex items-center gap-4">
            <ThemeToggle />
            <Avatar className="h-9 w-9">
              <AvatarFallback className="bg-primary/10 text-sm">
                {mockUser.initials}
              </AvatarFallback>
            </Avatar>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 md:px-6">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
            ¡Bienvenido, {mockUser.name.split(" ")[0]}!
          </h1>
          <p className="text-muted-foreground">
            Tu asistente de viajes está listo para ayudarte
          </p>
        </div>

        {/* Stats */}
        <div className="mb-8 grid gap-4 sm:grid-cols-3">
          {stats.map((stat) => (
            <Card key={stat.label}>
              <CardContent className="flex flex-col items-center justify-center p-6">
                <span className="text-3xl font-bold">{stat.value}</span>
                <span className="text-sm text-muted-foreground">
                  {stat.label}
                </span>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="mb-4 text-lg font-semibold">Acciones rápidas</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Button variant="outline" className="h-auto flex-col gap-2 p-6">
              <MapPin className="h-6 w-6" />
              <span>Explorar destinos</span>
            </Button>
            <Button variant="outline" className="h-auto flex-col gap-2 p-6">
              <Calendar className="h-6 w-6" />
              <span>Crear itinerario</span>
            </Button>
            <Button variant="outline" className="h-auto flex-col gap-2 p-6">
              <Settings className="h-6 w-6" />
              <span>Configuración</span>
            </Button>
            <Link href="/login">
              <Button
                variant="outline"
                className="h-auto w-full flex-col gap-2 p-6"
              >
                <LogOut className="h-6 w-6" />
                <span>Cerrar sesión</span>
              </Button>
            </Link>
          </div>
        </div>

        {/* User Preferences */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Tu perfil de viajero</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="mb-2 text-sm font-medium text-muted-foreground">
                Estilos de viaje
              </p>
              <div className="flex flex-wrap gap-2">
                {mockUser.preferences.travelStyles.map((style) => (
                  <Badge key={style} variant="secondary">
                    {style}
                  </Badge>
                ))}
              </div>
            </div>
            <div>
              <p className="mb-2 text-sm font-medium text-muted-foreground">
                Presupuesto
              </p>
              <Badge>{mockUser.preferences.budget}</Badge>
            </div>
            <div>
              <p className="mb-2 text-sm font-medium text-muted-foreground">
                Intereses
              </p>
              <div className="flex flex-wrap gap-2">
                {mockUser.preferences.interests.map((interest) => (
                  <Badge key={interest} variant="outline">
                    {interest}
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
