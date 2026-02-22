"use client";

import Link from "next/link";
import { ArrowLeft, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import type { MyTripsStats } from "@/hooks/use-my-trips";

interface TripsHeroProps {
  stats: MyTripsStats;
}

export function TripsHero({ stats }: TripsHeroProps) {
  const statItems = [
    { label: "Total", value: stats.total, color: "text-foreground" },
    { label: "Guardados", value: stats.guardados, color: "text-emerald-600 dark:text-emerald-400" },
    { label: "Generados", value: stats.generados, color: "text-slate-500" },
    { label: "Destinos", value: stats.destinos, color: "text-violet-600 dark:text-violet-400" },
    { label: "Lugares", value: stats.totalPlaces, color: "text-amber-600 dark:text-amber-400" },
  ];

  return (
    <div className="relative overflow-hidden border-b bg-background">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,var(--tw-gradient-stops))] from-blue-500/5 via-transparent to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-primary/20 to-transparent" />
      <div className="container relative mx-auto max-w-7xl px-4 py-6 md:px-6 lg:py-8">
        {/* Back + Title */}
        <div className="flex items-center gap-3 mb-6">
          <Link href="/dashboard">
            <Button variant="ghost" size="icon" className="h-9 w-9 cursor-pointer rounded-xl">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div className="flex-1">
            <h1 className="text-xl font-bold tracking-tight sm:text-2xl md:text-3xl">
              Mis Viajes
            </h1>
            <p className="text-xs text-muted-foreground sm:text-sm">
              Gestiona tus exploraciones y viajes guardados
            </p>
          </div>
          <Link href="/explore" className="hidden sm:block">
            <Button size="sm" className="gap-2 cursor-pointer shadow-md shadow-primary/20">
              <Sparkles className="h-4 w-4" />
              Nueva exploracion
            </Button>
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-5">
          {statItems.map((stat) => (
            <div key={stat.label} className="rounded-xl border bg-card p-3 text-center transition-colors">
              <p className={`text-lg font-bold tabular-nums sm:text-2xl ${stat.color}`}>
                {stat.value}
              </p>
              <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground sm:text-xs">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
