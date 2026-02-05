import {
  Mountain,
  Palmtree,
  Landmark,
  Utensils,
  TreePine,
  Wallet,
  CreditCard,
  Gem,
} from "lucide-react";
import type { TravelStyle, BudgetRange } from "@/types";

// Opciones de estilos de viaje
export interface TravelStyleOption {
  id: TravelStyle;
  label: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
}

export const travelStyleOptions: TravelStyleOption[] = [
  {
    id: "adventure",
    label: "Aventura",
    description: "Deportes extremos, senderismo y experiencias al límite",
    icon: Mountain,
  },
  {
    id: "relaxation",
    label: "Relax",
    description: "Playas, spas y descanso total",
    icon: Palmtree,
  },
  {
    id: "cultural",
    label: "Cultural",
    description: "Museos, historia y tradiciones locales",
    icon: Landmark,
  },
  {
    id: "gastronomic",
    label: "Gastronómico",
    description: "Cocina local, tours culinarios y vinos",
    icon: Utensils,
  },
  {
    id: "nature",
    label: "Naturaleza",
    description: "Parques nacionales, ecoturismo y vida silvestre",
    icon: TreePine,
  },
];

// Opciones de presupuesto
export interface BudgetOption {
  id: BudgetRange;
  label: string;
  description: string;
  priceRange: string;
  icon: React.ComponentType<{ className?: string }>;
}

export const budgetOptions: BudgetOption[] = [
  {
    id: "budget",
    label: "Económico",
    description: "Hostels, transporte público, comida local",
    priceRange: "Menos de $50/día",
    icon: Wallet,
  },
  {
    id: "moderate",
    label: "Moderado",
    description: "Hoteles 3-4 estrellas, restaurantes variados",
    priceRange: "$50 - $150/día",
    icon: CreditCard,
  },
  {
    id: "luxury",
    label: "Lujo",
    description: "Hoteles 5 estrellas, experiencias premium",
    priceRange: "Más de $150/día",
    icon: Gem,
  },
];

// Opciones de intereses
export const interestOptions: string[] = [
  "Fotografía",
  "Historia",
  "Arte",
  "Música",
  "Deportes",
  "Vida nocturna",
  "Compras",
  "Arquitectura",
  "Festivales",
  "Mercados locales",
  "Parques temáticos",
  "Tours guiados",
  "Buceo/Snorkel",
  "Ciclismo",
  "Yoga/Bienestar",
  "Café y barismo",
  "Cerveza artesanal",
  "Voluntariado",
];

// Metadatos de los pasos
export const onboardingSteps = [
  { id: 1, title: "Bienvenida" },
  { id: 2, title: "Estilos" },
  { id: 3, title: "Presupuesto" },
  { id: 4, title: "Intereses" },
  { id: 5, title: "Resumen" },
];
