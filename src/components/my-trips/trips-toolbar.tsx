"use client";

import {
  Search,
  Globe,
  BookmarkCheck,
  Clock,
  ArrowUpDown,
  LayoutGrid,
  LayoutList,
} from "lucide-react";
import type { SortKey, ViewMode } from "@/hooks/use-my-trips";
import type { Viaje } from "@/types";

const filterTabs = [
  { key: "all", label: "Todos", icon: Globe },
  { key: "guardada", label: "Guardados", icon: BookmarkCheck },
  { key: "generada", label: "Generados", icon: Clock },
];

interface TripsToolbarProps {
  activeFilter: string;
  trips: Viaje[];
  searchQuery: string;
  sortBy: SortKey;
  viewMode: ViewMode;
  onFilterChange: (filter: string) => void;
  onSearchChange: (query: string) => void;
  onSortChange: (sort: SortKey) => void;
  onViewModeChange: (mode: ViewMode) => void;
}

export function TripsToolbar({
  activeFilter,
  trips,
  searchQuery,
  sortBy,
  viewMode,
  onFilterChange,
  onSearchChange,
  onSortChange,
  onViewModeChange,
}: TripsToolbarProps) {
  return (
    <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      {/* Left: Filters */}
      <div className="flex items-center gap-1.5 overflow-x-auto">
        {filterTabs.map((tab) => {
          const count =
            tab.key === "all"
              ? trips.length
              : trips.filter((t) => t.estado === tab.key).length;
          const Icon = tab.icon;
          const isActive = activeFilter === tab.key;
          return (
            <button
              key={tab.key}
              type="button"
              className={`inline-flex shrink-0 items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition-all cursor-pointer ${
                isActive
                  ? "border-primary bg-primary text-primary-foreground shadow-sm"
                  : "border-transparent bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
              onClick={() => onFilterChange(tab.key)}
            >
              <Icon className="h-3.5 w-3.5" />
              {tab.label}
              <span
                className={`ml-0.5 rounded-full px-1.5 py-0.5 text-[10px] tabular-nums ${
                  isActive
                    ? "bg-primary-foreground/20 text-primary-foreground"
                    : "bg-background text-muted-foreground"
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Right: Search, Sort, View */}
      <div className="flex items-center gap-2">
        {/* Search */}
        <div className="relative flex-1 sm:w-48 sm:flex-none">
          <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Buscar..."
            className="flex h-8 w-full rounded-lg border border-input bg-background pl-8 pr-3 text-xs transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary/30"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>

        {/* Sort */}
        <div className="relative">
          <select
            className="h-8 cursor-pointer appearance-none rounded-lg border bg-background pl-2.5 pr-7 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary/30"
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value as SortKey)}
          >
            <option value="newest">Recientes</option>
            <option value="oldest">Antiguos</option>
            <option value="city">Ciudad A-Z</option>
          </select>
          <ArrowUpDown className="pointer-events-none absolute right-2 top-1/2 h-3 w-3 -translate-y-1/2 text-muted-foreground" />
        </div>

        {/* View toggle */}
        <div className="hidden items-center rounded-lg border bg-muted/50 p-0.5 sm:flex">
          <button
            type="button"
            className={`cursor-pointer rounded-md p-1.5 transition-colors ${
              viewMode === "grid"
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
            onClick={() => onViewModeChange("grid")}
          >
            <LayoutGrid className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            className={`cursor-pointer rounded-md p-1.5 transition-colors ${
              viewMode === "list"
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
            onClick={() => onViewModeChange("list")}
          >
            <LayoutList className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
