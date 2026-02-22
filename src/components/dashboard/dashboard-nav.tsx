"use client";

import Link from "next/link";
import { Map, BookmarkCheck, Users, User } from "lucide-react";

import { Button } from "@/components/ui/button";

const navLinks = [
  { icon: Map, label: "Explorar", href: "/explore" },
  { icon: BookmarkCheck, label: "Mis viajes", href: "/my-trips" },
  { icon: Users, label: "Comunidad", href: "/community" },
  { icon: User, label: "Perfil", href: "/profile" },
];

export function DashboardNav() {
  return (
    <div className="mb-6 flex gap-2 overflow-x-auto">
      {navLinks.map((item) => {
        const Icon = item.icon;
        return (
          <Link key={item.label} href={item.href}>
            <Button variant="outline" size="sm" className="gap-2 cursor-pointer whitespace-nowrap">
              <Icon className="h-4 w-4" />
              {item.label}
            </Button>
          </Link>
        );
      })}
    </div>
  );
}
