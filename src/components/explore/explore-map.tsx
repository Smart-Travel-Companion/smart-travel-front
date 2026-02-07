"use client";

import { useEffect, useRef } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Tooltip,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import type { Place } from "@/lib/auth";

// Numbered marker icon
function createNumberedIcon(index: number, isActive: boolean) {
  const size = isActive ? 40 : 30;
  const color = isActive ? "#7c3aed" : "#2563eb";

  return L.divIcon({
    className: "custom-marker-numbered",
    html: `
      <div style="
        width: ${size}px;
        height: ${size}px;
        background: ${color};
        border: 3px solid white;
        border-radius: 50%;
        box-shadow: 0 2px 10px rgba(0,0,0,0.35);
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.2s ease;
        cursor: pointer;
      ">
        <span style="
          color: white;
          font-weight: 700;
          font-size: ${isActive ? 16 : 13}px;
          line-height: 1;
        ">${index + 1}</span>
      </div>
    `,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
    popupAnchor: [0, -(size / 2)],
  });
}

// Auto-fit bounds to show all markers
function FitBounds({ places }: { places: Place[] }) {
  const map = useMap();

  useEffect(() => {
    if (places.length === 0) return;
    const bounds = L.latLngBounds(
      places.map((p) => [p.latitude, p.longitude] as [number, number])
    );
    map.fitBounds(bounds, { padding: [50, 50], maxZoom: 15 });
  }, [places, map]);

  return null;
}

// Fly to a specific place on selection
function FlyToPlace({
  place,
  trigger,
}: {
  place: Place | null;
  trigger: number;
}) {
  const map = useMap();

  useEffect(() => {
    if (place && trigger > 0) {
      map.flyTo([place.latitude, place.longitude], 16, { duration: 0.8 });
    }
  }, [place, trigger, map]);

  return null;
}

interface ExploreMapProps {
  places: Place[];
  activeIndex: number | null;
  onMarkerClick: (index: number) => void;
  flyToTrigger: number;
}

export function ExploreMap({
  places,
  activeIndex,
  onMarkerClick,
  flyToTrigger,
}: ExploreMapProps) {
  const markersRef = useRef<(L.Marker | null)[]>([]);

  if (places.length === 0) return null;

  const center: [number, number] = [places[0].latitude, places[0].longitude];

  return (
    <MapContainer
      center={center}
      zoom={14}
      className="h-full w-full rounded-xl"
      style={{ minHeight: "100%" }}
      zoomControl={true}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <FitBounds places={places} />
      <FlyToPlace
        place={activeIndex !== null ? places[activeIndex] : null}
        trigger={flyToTrigger}
      />

      {places.map((place, i) => (
        <Marker
          key={place.name + i}
          position={[place.latitude, place.longitude]}
          icon={createNumberedIcon(i, activeIndex === i)}
          ref={(ref) => {
            markersRef.current[i] = ref;
          }}
          eventHandlers={{
            click: () => onMarkerClick(i),
          }}
        >
          <Tooltip direction="top" offset={[0, -20]}>
            <span style={{ fontWeight: 600, fontSize: 13 }}>{place.name}</span>
          </Tooltip>
        </Marker>
      ))}
    </MapContainer>
  );
}
