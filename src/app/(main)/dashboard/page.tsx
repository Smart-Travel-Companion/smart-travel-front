"use client";

import { Header, Footer } from "@/components/layout";
import { AuthGuard } from "@/components/layout/auth-guard";
import { useAuth } from "@/providers/auth-provider";
import { useDashboard } from "@/hooks/use-dashboard";
import {
  DashboardHero,
  DashboardNav,
  RecentTripsSection,
  DashboardBottomRow,
} from "@/components/dashboard";

export default function DashboardPage() {
  const { user } = useAuth();
  const { isLoadingTrips, stats, recentTrips } = useDashboard();

  return (
    <AuthGuard>
      <div className="flex min-h-screen flex-col">
        <Header />

        <main className="flex-1 bg-muted/30">
          <DashboardHero user={user} isLoadingTrips={isLoadingTrips} stats={stats} />

          <div className="container mx-auto max-w-6xl px-4 py-6 md:px-6">
            <DashboardNav />
            <RecentTripsSection trips={recentTrips} isLoading={isLoadingTrips} />
            <DashboardBottomRow user={user} />
          </div>
        </main>

        <Footer />
      </div>
    </AuthGuard>
  );
}
