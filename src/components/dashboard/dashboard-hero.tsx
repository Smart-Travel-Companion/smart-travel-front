"use client";

import Link from "next/link";
import {
  MapPin,
  Sparkles,
  Globe,
  Map,
  BookmarkCheck,
  Loader2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { getInitials, getGreeting } from "@/lib/formatters";
import type { User } from "@/types";
import type { DashboardStats } from "@/hooks/use-dashboard";

interface DashboardHeroProps {
  user: User | null;
  isLoadingTrips: boolean;
  stats: DashboardStats;
}

export function DashboardHero({ user, isLoadingTrips, stats }: DashboardHeroProps) {
  const firstName = user?.nombre?.split(" ")[0] || "Viajero";
  const hasProfile = user?.pais || user?.ciudad;

  const kpis = [
    { label: "Viajes", value: stats.totalTrips, icon: Map, color: "text-blue-600", bg: "bg-blue-50 dark:bg-blue-950/30" },
    { label: "Guardados", value: stats.savedTrips, icon: BookmarkCheck, color: "text-emerald-600", bg: "bg-emerald-50 dark:bg-emerald-950/30" },
    { label: "Destinos", value: stats.uniqueDestinations, icon: Globe, color: "text-violet-600", bg: "bg-violet-50 dark:bg-violet-950/30" },
    { label: "Lugares", value: stats.totalPlaces, icon: MapPin, color: "text-amber-600", bg: "bg-amber-50 dark:bg-amber-950/30" },
  ];

  return (
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
          {kpis.map((s) => {
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
  );
}
