import {
  Compass,
  Map,
  Calendar,
  Sparkles,
  Globe,
  Shield,
  Plane,
  Hotel,
  Database
} from "lucide-react";
import type { NavItem, Feature, Step } from "@/types";

export const siteConfig = {
  name: "Smart Travel Companion",
  description: "Tu asistente inteligente para planificar experiencias turísticas personalizadas",
  url: "https://smarttravel.com",
};

export const navItems: NavItem[] = [
  {
    title: "Inicio",
    href: "/",
  },
  {
    title: "Cómo funciona",
    href: "/#how-it-works",
  },
  {
    title: "Características",
    href: "/#features",
  },
  {
    title: "Partners",
    href: "/#partners",
  },
];

export const features: Feature[] = [
  {
    icon: Sparkles,
    title: "IA Personalizada",
    description: "Algoritmos inteligentes que aprenden de tus preferencias para crear itinerarios únicos.",
  },
  {
    icon: Map,
    title: "Mapas Interactivos",
    description: "Visualización de puntos de interés con información contextual en tiempo real.",
  },
  {
    icon: Globe,
    title: "Datos Centralizados",
    description: "Información turística actualizada de múltiples fuentes en un solo lugar.",
  },
  {
    icon: Shield,
    title: "Viaje Seguro",
    description: "Recomendaciones verificadas y alertas de seguridad para tu destino.",
  },
];

export const steps: Step[] = [
  {
    number: 1,
    title: "Define tu perfil",
    description: "Cuéntanos tus preferencias de viaje, presupuesto e intereses.",
    icon: Compass,
  },
  {
    number: 2,
    title: "Explora destinos",
    description: "Descubre lugares con mapas interactivos y POIs inteligentes.",
    icon: Map,
  },
  {
    number: 3,
    title: "Organiza tu itinerario",
    description: "Arrastra y suelta actividades para crear tu plan perfecto.",
    icon: Calendar,
  },
];

export const partners = [
  {
    name: "Aerolíneas",
    description: "Con las mejores opciones",
    icon: Plane,
  },
  {
    name: "Hoteles",
    description: "Acomodación ideal a tu medida",
    icon: Hotel,
  },
  {
    name: "Plataformas de Datos",
    description: "Información actualizada y relevante",
    icon: Database,
  },
];
