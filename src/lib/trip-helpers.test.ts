import { describe, it, expect } from "vitest";
import {
  getTripImage,
  getTripCity,
  getPlacesCount,
  buildExploreUrl,
} from "./trip-helpers";
import { buildViaje, buildPlace } from "@/test/factories";

describe("getTripImage", () => {
  it("returns image_url from the first place", () => {
    const trip = buildViaje({
      places: [buildPlace({ image_url: "https://img.jpg" })],
    });
    expect(getTripImage(trip)).toBe("https://img.jpg");
  });

  it("returns null when places array is empty", () => {
    const trip = buildViaje({ places: [] });
    expect(getTripImage(trip)).toBeNull();
  });

  it("returns null when image_url is empty string", () => {
    const trip = buildViaje({
      places: [buildPlace({ image_url: "" })],
    });
    expect(getTripImage(trip)).toBeNull();
  });
});

describe("getTripCity", () => {
  it("returns the city name from ubicacion", () => {
    const trip = buildViaje();
    expect(getTripCity(trip)).toBe("Bogota");
  });

  it("returns fallback when no city", () => {
    const trip = buildViaje({
      ubicacion: { radiusKm: 10 },
    });
    expect(getTripCity(trip)).toBe("Sin ciudad");
  });
});

describe("getPlacesCount", () => {
  it("returns the number of places", () => {
    const trip = buildViaje({ places: [buildPlace(), buildPlace()] });
    expect(getPlacesCount(trip)).toBe(2);
  });

  it("returns 0 when places is empty", () => {
    const trip = buildViaje({ places: [] });
    expect(getPlacesCount(trip)).toBe(0);
  });
});

describe("buildExploreUrl", () => {
  it("builds URL with city and coordinates", () => {
    const trip = buildViaje();
    const url = buildExploreUrl(trip);
    expect(url).toContain("/explore?");
    expect(url).toContain("city=Bogota");
    expect(url).toContain("lat=4.601");
    expect(url).toContain("lon=-74.072");
  });

  it("returns bare /explore when no location data", () => {
    const trip = buildViaje({ ubicacion: { radiusKm: 10 } });
    expect(buildExploreUrl(trip)).toBe("/explore");
  });
});
