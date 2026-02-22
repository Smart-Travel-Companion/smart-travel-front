import type { RecomendacionesByCity, RecomendacionesByCoords, RecomendacionesResponse } from "@/types";
import { apiFetch } from "./api-client";

export async function getRecomendaciones(
  params: RecomendacionesByCity | RecomendacionesByCoords
): Promise<RecomendacionesResponse> {
  return apiFetch<RecomendacionesResponse>("/api/recomendaciones", {
    method: "POST",
    auth: true,
    body: JSON.stringify(params),
  });
}
