"use client";

import Link from "next/link";
import { Search, Globe, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";

interface TripsEmptyStateProps {
  searchQuery: string;
  activeFilter: string;
}

export function TripsEmptyState({ searchQuery, activeFilter }: TripsEmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-muted">
        {searchQuery ? (
          <Search className="h-9 w-9 text-muted-foreground/30" />
        ) : (
          <Globe className="h-9 w-9 text-muted-foreground/30" />
        )}
      </div>
      <h3 className="mt-5 text-lg font-semibold">
        {searchQuery
          ? `Sin resultados para "${searchQuery}"`
          : activeFilter === "all"
            ? "Aun no tienes viajes"
            : "No hay viajes con este filtro"}
      </h3>
      <p className="mt-2 max-w-sm text-sm text-muted-foreground">
        {searchQuery
          ? "Intenta con otros terminos de busqueda."
          : activeFilter === "all"
            ? "Explora destinos y guarda tus recomendaciones favoritas para verlas aqui."
            : "Prueba con otro filtro o explora nuevos destinos."}
      </p>
      {!searchQuery && (
        <Link href="/explore">
          <Button className="mt-6 gap-2 cursor-pointer">
            <Sparkles className="h-4 w-4" />
            Explorar destinos
          </Button>
        </Link>
      )}
    </div>
  );
}
