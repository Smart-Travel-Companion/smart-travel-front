// User types
export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  preferences?: UserPreferences;
  createdAt: Date;
}

export interface UserPreferences {
  travelStyle: TravelStyle[];
  budget: BudgetRange;
  interests: string[];
}

export type TravelStyle = "adventure" | "relaxation" | "cultural" | "gastronomic" | "nature";
export type BudgetRange = "budget" | "moderate" | "luxury";

// Navigation types
export interface NavItem {
  title: string;
  href: string;
  description?: string;
  disabled?: boolean;
  external?: boolean;
  icon?: React.ComponentType<{ className?: string }>;
}

// Landing page types
export interface Feature {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
}

export interface Partner {
  name: string;
  logo: string;
}

export interface Step {
  number: number;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
}
