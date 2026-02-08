"use client";

import { useState } from "react";
import {
  MapPin,
  Clock,
  Navigation,
  ChevronLeft,
  ChevronRight,
  ImageOff,
  Calendar,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Place } from "@/lib/auth";

interface PlaceDetailProps {
  place: Place;
  index: number;
}

export function PlaceDetail({ place, index }: PlaceDetailProps) {
  const [currentImage, setCurrentImage] = useState(0);
  const [imageError, setImageError] = useState(false);

  const allImages = [place.image_url, ...(place.images || [])].filter(Boolean);
  const hasMultipleImages = allImages.length > 1;
  const categories = place.category.split(",").map((c) => c.trim());

  function nextImage() {
    setCurrentImage((prev) => (prev + 1) % allImages.length);
    setImageError(false);
  }

  function prevImage() {
    setCurrentImage((prev) => (prev - 1 + allImages.length) % allImages.length);
    setImageError(false);
  }

  function formatTime(min: number): string {
    if (min < 60) return `${min} min`;
    const hours = Math.floor(min / 60);
    const remaining = min % 60;
    return remaining > 0 ? `${hours}h ${remaining}min` : `${hours}h`;
  }

  return (
    <div className="border-b bg-background">
      <div className="container mx-auto max-w-7xl px-4 py-6 md:px-6">
        <div className="flex flex-col gap-6 lg:flex-row lg:gap-8">
          {/* Image Gallery */}
          <div className="lg:w-[45%] xl:w-[40%] shrink-0">
            {/* Main image */}
            <div className="group relative aspect-[16/10] overflow-hidden rounded-xl bg-muted">
              {!imageError && allImages.length > 0 ? (
                <img
                  src={allImages[currentImage]}
                  alt={place.name}
                  className="h-full w-full object-cover transition-transform duration-500"
                  onError={() => setImageError(true)}
                />
              ) : (
                <div className="flex h-full items-center justify-center">
                  <ImageOff className="h-12 w-12 text-muted-foreground/30" />
                </div>
              )}

              {/* Navigation arrows */}
              {hasMultipleImages && !imageError && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-black/50 text-white opacity-0 backdrop-blur-sm transition-opacity hover:bg-black/70 group-hover:opacity-100 cursor-pointer"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-black/50 text-white opacity-0 backdrop-blur-sm transition-opacity hover:bg-black/70 group-hover:opacity-100 cursor-pointer"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>

                  {/* Counter */}
                  <div className="absolute bottom-3 right-3 rounded-full bg-black/60 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm">
                    {currentImage + 1} / {allImages.length}
                  </div>
                </>
              )}

              {/* Number badge */}
              <div className="absolute left-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white shadow-lg">
                {index + 1}
              </div>
            </div>

            {/* Thumbnails */}
            {allImages.length > 1 && (
              <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
                {allImages.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      setCurrentImage(i);
                      setImageError(false);
                    }}
                    className={`h-16 w-20 shrink-0 overflow-hidden rounded-lg transition-all cursor-pointer ${
                      i === currentImage
                        ? "ring-2 ring-primary opacity-100"
                        : "opacity-50 hover:opacity-80"
                    }`}
                  >
                    <img
                      src={img}
                      alt={`${place.name} ${i + 1}`}
                      className="h-full w-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = "none";
                      }}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info Panel */}
          <div className="flex-1 min-w-0">
            {/* Categories */}
            <div className="mb-3 flex flex-wrap gap-1.5">
              {categories.map((cat) => (
                <Badge
                  key={cat}
                  variant="secondary"
                  className="rounded-full text-xs"
                >
                  {cat}
                </Badge>
              ))}
            </div>

            {/* Title */}
            <h2 className="text-2xl font-bold tracking-tight md:text-3xl">
              {place.name}
            </h2>

            {/* Short reason */}
            <p className="mt-2 text-base font-medium text-primary/80">
              {place.short_reason}
            </p>

            {/* Description */}
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              {place.description}
            </p>

            {/* Info grid */}
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {/* Address */}
              <div className="flex items-start gap-3 rounded-lg border p-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-500/10">
                  <MapPin className="h-4 w-4 text-blue-500" />
                </div>
                <div className="min-w-0">
                  <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                    Dirección
                  </p>
                  <p className="mt-0.5 text-sm">{place.address}</p>
                </div>
              </div>

              {/* Distance */}
              <div className="flex items-start gap-3 rounded-lg border p-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-500/10">
                  <Navigation className="h-4 w-4 text-emerald-500" />
                </div>
                <div>
                  <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                    Distancia
                  </p>
                  <p className="mt-0.5 text-sm">
                    {place.distance_km.toFixed(1)} km del centro
                  </p>
                </div>
              </div>

              {/* Estimated time */}
              {place.estimated_time_min > 0 && (
                <div className="flex items-start gap-3 rounded-lg border p-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-amber-500/10">
                    <Clock className="h-4 w-4 text-amber-500" />
                  </div>
                  <div>
                    <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                      Tiempo estimado
                    </p>
                    <p className="mt-0.5 text-sm">
                      {formatTime(place.estimated_time_min)}
                    </p>
                  </div>
                </div>
              )}

              {/* Opening hours */}
              {place.opening_hours && (
                <div className="flex items-start gap-3 rounded-lg border p-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-violet-500/10">
                    <Calendar className="h-4 w-4 text-violet-500" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                      Horarios
                    </p>
                    <p className="mt-0.5 text-sm leading-snug">
                      {place.opening_hours}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
