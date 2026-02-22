"use client";

import Link from "next/link";
import Image from "next/image";
import {
  Sparkles,
  Map,
  ArrowRight,
  ImageOff,
  Loader2,
  Layers,
  Calendar,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/formatters";
import { getTripImage } from "@/lib/trip-helpers";
import type { Viaje } from "@/types";

interface RecentTripsSectionProps {
  trips: Viaje[];
  isLoading: boolean;
}

export function RecentTripsSection({ trips, isLoading }: RecentTripsSectionProps) {
  return (
    <div className="mb-8">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-sm font-semibold">Viajes recientes</h2>
        {trips.length > 0 && (
          <Link href="/my-trips">
            <Button variant="ghost" size="sm" className="gap-1 text-xs cursor-pointer text-muted-foreground">
              Ver todos <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </Link>
        )}
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : trips.length === 0 ? (
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
          {trips.map((trip) => {
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
                      <Calendar className="h-3 w-3" /> {formatDate(trip.createdAt, "short")}
                    </span>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
