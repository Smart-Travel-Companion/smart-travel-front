/** Extract initials from a full name, e.g. "Juan Perez" -> "JP" */
export function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

/**
 * Format a date string with configurable presets.
 * "short" = "15 ene" (dashboard style)
 * "medium" = "15 ene 2025" (my-trips, community style)
 * "long" = "15 de enero de 2025" (profile style)
 */
export function formatDate(
  dateStr: string | undefined,
  variant: "short" | "medium" | "long" = "medium"
): string {
  if (!dateStr) return "\u2014";
  const options: Intl.DateTimeFormatOptions =
    variant === "short"
      ? { day: "numeric", month: "short" }
      : variant === "medium"
        ? { day: "numeric", month: "short", year: "numeric" }
        : { year: "numeric", month: "long", day: "numeric" };
  return new Date(dateStr).toLocaleDateString("es-ES", options);
}

/** Format a date as a relative string: "Hoy", "Ayer", "Hace 3 dias", etc. */
export function formatDateRelative(dateStr: string): string {
  const now = new Date();
  const date = new Date(dateStr);
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "Hoy";
  if (diffDays === 1) return "Ayer";
  if (diffDays < 7) return `Hace ${diffDays} dias`;
  if (diffDays < 30) return `Hace ${Math.floor(diffDays / 7)} sem.`;
  return formatDate(dateStr, "medium");
}

/** Get greeting based on time of day */
export function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Buenos dias";
  if (hour < 18) return "Buenas tardes";
  return "Buenas noches";
}

/** Calculate days since a date */
export function getDaysSinceDate(dateStr?: string): number {
  if (!dateStr) return 0;
  const diff = Date.now() - new Date(dateStr).getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24));
}
