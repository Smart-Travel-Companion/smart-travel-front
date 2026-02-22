"use client";

import { Header, Footer } from "@/components/layout";
import { AuthGuard } from "@/components/layout/auth-guard";
import { useMyTrips } from "@/hooks/use-my-trips";
import {
  TripsHero,
  TripsToolbar,
  TripCardGrid,
  TripCardList,
  TripsEmptyState,
} from "@/components/my-trips";

export default function MyTripsPage() {
  const {
    trips,
    isLoading,
    activeFilter,
    setActiveFilter,
    deletingId,
    savingId,
    searchQuery,
    setSearchQuery,
    sortBy,
    setSortBy,
    viewMode,
    setViewMode,
    confirmDeleteId,
    setConfirmDeleteId,
    filteredAndSortedTrips,
    handleDelete,
    handleSave,
    stats,
  } = useMyTrips();

  return (
    <AuthGuard>
      <div className="flex min-h-screen flex-col bg-muted/20">
        <Header />

        <main className="flex-1">
          <TripsHero stats={stats} />

          <div className="container mx-auto max-w-7xl px-4 py-5 md:px-6 lg:py-6">
            <TripsToolbar
              activeFilter={activeFilter}
              trips={trips}
              searchQuery={searchQuery}
              sortBy={sortBy}
              viewMode={viewMode}
              onFilterChange={setActiveFilter}
              onSearchChange={setSearchQuery}
              onSortChange={setSortBy}
              onViewModeChange={setViewMode}
            />

            {/* Loading */}
            {isLoading && (
              <div className="flex flex-col items-center justify-center py-24">
                <div className="relative">
                  <div className="h-14 w-14 rounded-full border-4 border-muted" />
                  <div className="absolute inset-0 h-14 w-14 animate-spin rounded-full border-4 border-transparent border-t-primary" />
                </div>
                <p className="mt-4 text-sm text-muted-foreground">Cargando tus viajes...</p>
              </div>
            )}

            {/* Empty state */}
            {!isLoading && filteredAndSortedTrips.length === 0 && (
              <TripsEmptyState searchQuery={searchQuery} activeFilter={activeFilter} />
            )}

            {/* Grid view */}
            {!isLoading && filteredAndSortedTrips.length > 0 && viewMode === "grid" && (
              <TripCardGrid
                trips={filteredAndSortedTrips}
                savingId={savingId}
                deletingId={deletingId}
                confirmDeleteId={confirmDeleteId}
                onSave={handleSave}
                onDelete={handleDelete}
                onConfirmDelete={setConfirmDeleteId}
              />
            )}

            {/* List view */}
            {!isLoading && filteredAndSortedTrips.length > 0 && viewMode === "list" && (
              <TripCardList
                trips={filteredAndSortedTrips}
                savingId={savingId}
                deletingId={deletingId}
                confirmDeleteId={confirmDeleteId}
                onSave={handleSave}
                onDelete={handleDelete}
                onConfirmDelete={setConfirmDeleteId}
              />
            )}

            {/* Results count */}
            {!isLoading && filteredAndSortedTrips.length > 0 && (
              <p className="mt-4 text-center text-xs text-muted-foreground">
                Mostrando {filteredAndSortedTrips.length} de {trips.length} viaje
                {trips.length !== 1 && "s"}
              </p>
            )}
          </div>
        </main>

        <Footer />
      </div>
    </AuthGuard>
  );
}
