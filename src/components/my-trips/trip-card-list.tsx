"use client";

import Link from "next/link";
import Image from "next/image";
import {
  MapPin,
  Calendar,
  Loader2,
  Trash2,
  ImageOff,
  Bookmark,
  ChevronRight,
  Layers,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { formatDate } from "@/lib/formatters";
import { getTripImage, getTripCity, getPlacesCount } from "@/lib/trip-helpers";
import type { Viaje } from "@/types";

const estadoConfig: Record<
  string,
  { label: string; badgeVariant: "default" | "secondary" }
> = {
  generada: { label: "Generado", badgeVariant: "secondary" },
  guardada: { label: "Guardado", badgeVariant: "default" },
};

interface TripCardListProps {
  trips: Viaje[];
  savingId: string | null;
  deletingId: string | null;
  confirmDeleteId: string | null;
  onSave: (tripId: string) => void;
  onDelete: (tripId: string) => void;
  onConfirmDelete: (tripId: string | null) => void;
}

export function TripCardList({
  trips,
  savingId,
  deletingId,
  confirmDeleteId,
  onSave,
  onDelete,
  onConfirmDelete,
}: TripCardListProps) {
  return (
    <Card>
      <CardContent className="p-0">
        <div className="divide-y">
          {trips.map((trip) => {
            const img = getTripImage(trip);
            const city = getTripCity(trip);
            const placesCount = getPlacesCount(trip);
            const config = estadoConfig[trip.estado] || estadoConfig.generada;

            return (
              <div key={trip._id} className="flex items-center gap-3 p-3 transition-colors hover:bg-muted/30 sm:gap-4 sm:p-4">
                {/* Thumbnail */}
                <div className="h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-muted sm:h-16 sm:w-20">
                  {img ? (
                    <Image src={img} alt={city} width={80} height={64} className="h-full w-full object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
                  ) : (
                    <div className="flex h-full items-center justify-center">
                      <ImageOff className="h-5 w-5 text-muted-foreground/20" />
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-3.5 w-3.5 shrink-0 text-primary" />
                    <p className="truncate text-sm font-semibold">{city}</p>
                    <Badge variant={config.badgeVariant} className="shrink-0 rounded-full px-2 py-0 text-[9px]">
                      {config.label}
                    </Badge>
                  </div>
                  <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {formatDate(trip.createdAt)}
                    </span>
                    <span className="flex items-center gap-1">
                      <Layers className="h-3 w-3" />
                      {placesCount} lugares
                    </span>
                    <span className="hidden sm:flex items-center gap-1">
                      {trip.preferencias.slice(0, 3).map((pref) => (
                        <span key={pref} className="inline-flex rounded bg-muted px-1.5 py-0.5 text-[10px] capitalize">
                          {pref}
                        </span>
                      ))}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex shrink-0 items-center gap-1.5">
                  {trip.estado === "generada" && (
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-blue-600 hover:text-blue-700 cursor-pointer" onClick={() => onSave(trip._id)} disabled={savingId === trip._id}>
                      {savingId === trip._id ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Bookmark className="h-3.5 w-3.5" />}
                    </Button>
                  )}
                  {confirmDeleteId === trip._id ? (
                    <div className="flex items-center gap-1">
                      <Button variant="destructive" size="sm" className="h-7 px-2 text-[10px] cursor-pointer" onClick={() => onDelete(trip._id)} disabled={deletingId === trip._id}>
                        {deletingId === trip._id ? <Loader2 className="h-3 w-3 animate-spin" /> : "Si"}
                      </Button>
                      <Button variant="ghost" size="sm" className="h-7 px-2 text-[10px] cursor-pointer" onClick={() => onConfirmDelete(null)}>
                        No
                      </Button>
                    </div>
                  ) : (
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive cursor-pointer" onClick={() => onConfirmDelete(trip._id)} disabled={deletingId === trip._id}>
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  )}
                  <Link href={`/explore?tripId=${trip._id}`}>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0 cursor-pointer">
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
