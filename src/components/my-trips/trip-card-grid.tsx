"use client";

import Link from "next/link";
import Image from "next/image";
import {
  MapPin,
  Calendar,
  Loader2,
  Trash2,
  Eye,
  BookmarkCheck,
  Clock,
  ImageOff,
  Bookmark,
  Layers,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { formatDateRelative } from "@/lib/formatters";
import { getTripImage, getTripCity, getPlacesCount } from "@/lib/trip-helpers";
import type { Viaje } from "@/types";

const estadoConfig: Record<
  string,
  {
    label: string;
    badgeVariant: "default" | "secondary";
    icon: React.ComponentType<{ className?: string }>;
  }
> = {
  generada: { label: "Generado", badgeVariant: "secondary", icon: Clock },
  guardada: { label: "Guardado", badgeVariant: "default", icon: BookmarkCheck },
};

interface TripCardGridProps {
  trips: Viaje[];
  savingId: string | null;
  deletingId: string | null;
  confirmDeleteId: string | null;
  onSave: (tripId: string) => void;
  onDelete: (tripId: string) => void;
  onConfirmDelete: (tripId: string | null) => void;
}

export function TripCardGrid({
  trips,
  savingId,
  deletingId,
  confirmDeleteId,
  onSave,
  onDelete,
  onConfirmDelete,
}: TripCardGridProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {trips.map((trip) => {
        const img = getTripImage(trip);
        const city = getTripCity(trip);
        const placesCount = getPlacesCount(trip);
        const config = estadoConfig[trip.estado] || estadoConfig.generada;
        const StatusIcon = config.icon;

        return (
          <Card key={trip._id} className="group overflow-hidden transition-all hover:shadow-lg hover:border-primary/20">
            {/* Image */}
            <div className="relative aspect-16/10 overflow-hidden bg-muted">
              {img ? (
                <Image
                  src={img}
                  alt={city}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                />
              ) : (
                <div className="flex h-full items-center justify-center">
                  <ImageOff className="h-10 w-10 text-muted-foreground/15" />
                </div>
              )}
              <div className="absolute inset-0 bg-linear-to-t from-black/40 via-transparent to-transparent" />
              <div className="absolute right-2.5 top-2.5">
                <Badge variant={config.badgeVariant} className="gap-1 rounded-full text-[10px] font-medium shadow-sm backdrop-blur-sm">
                  <StatusIcon className="h-3 w-3" />
                  {config.label}
                </Badge>
              </div>
              <div className="absolute bottom-2.5 left-3 right-3">
                <h3 className="flex items-center gap-1.5 text-sm font-bold text-white drop-shadow-md">
                  <MapPin className="h-3.5 w-3.5 shrink-0" />
                  <span className="truncate">{city}</span>
                </h3>
              </div>
            </div>

            <CardContent className="p-4">
              {/* Meta */}
              <div className="mb-3 flex items-center gap-3 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {formatDateRelative(trip.createdAt)}
                </span>
                <span className="flex items-center gap-1">
                  <Layers className="h-3 w-3" />
                  {placesCount} lugares
                </span>
              </div>

              {/* Preferences tags */}
              <div className="mb-4 flex flex-wrap gap-1">
                {trip.preferencias.slice(0, 3).map((pref) => (
                  <span key={pref} className="inline-flex rounded-md bg-muted px-2 py-0.5 text-[10px] font-medium capitalize text-muted-foreground">
                    {pref}
                  </span>
                ))}
                {trip.preferencias.length > 3 && (
                  <span className="inline-flex rounded-md bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
                    +{trip.preferencias.length - 3}
                  </span>
                )}
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <Link href={`/explore?tripId=${trip._id}`} className="flex-1">
                  <Button variant="default" size="sm" className="w-full gap-1.5 text-xs cursor-pointer">
                    <Eye className="h-3.5 w-3.5" />
                    Ver viaje
                  </Button>
                </Link>
                {trip.estado === "generada" && (
                  <Button variant="outline" size="sm" className="gap-1.5 text-xs cursor-pointer" onClick={() => onSave(trip._id)} disabled={savingId === trip._id}>
                    {savingId === trip._id ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Bookmark className="h-3.5 w-3.5" />}
                  </Button>
                )}
                {confirmDeleteId === trip._id ? (
                  <div className="flex items-center gap-1">
                    <Button variant="destructive" size="sm" className="h-8 gap-1 px-2 text-[10px] cursor-pointer" onClick={() => onDelete(trip._id)} disabled={deletingId === trip._id}>
                      {deletingId === trip._id ? <Loader2 className="h-3 w-3 animate-spin" /> : "Si"}
                    </Button>
                    <Button variant="ghost" size="sm" className="h-8 px-2 text-[10px] cursor-pointer" onClick={() => onConfirmDelete(null)}>
                      No
                    </Button>
                  </div>
                ) : (
                  <Button variant="ghost" size="sm" className="text-xs text-muted-foreground hover:text-destructive cursor-pointer" onClick={() => onConfirmDelete(trip._id)} disabled={deletingId === trip._id}>
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
