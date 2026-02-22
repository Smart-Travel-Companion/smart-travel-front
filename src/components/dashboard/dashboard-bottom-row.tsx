"use client";

import Link from "next/link";
import { Compass, Sparkles, Users, Globe } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { User } from "@/types";

interface DashboardBottomRowProps {
  user: User | null;
}

export function DashboardBottomRow({ user }: DashboardBottomRowProps) {
  const hasPreferences = user?.preferencias && user.preferencias.length > 0;

  return (
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
  );
}
