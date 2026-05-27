"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen, FileText, Grid2X2 } from "lucide-react";
import { cn } from "@/lib/utils";

const items = [
  { href: "/", label: "Home", icon: Grid2X2 },
  { href: "/assignments", label: "Assignments", icon: FileText },
  { href: "/library", label: "Library", icon: BookOpen },
  { href: "/toolkit", label: "Toolkit", icon: BookOpen }
];

export function MobileNav() {
  const pathname = usePathname();

  return (
    <nav className="no-print fixed inset-x-0 bottom-4 z-30 mx-auto flex h-[72px] w-[calc(100vw-32px)] max-w-[373px] items-center justify-around rounded-[26px] bg-primary px-4 shadow-realistic desktop:hidden">
      {items.map((item) => {
        const Icon = item.icon;
        const active = item.href === "/assignments" ? pathname.startsWith("/assignments") : pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "focus-ring flex w-[72px] flex-col items-center gap-1 rounded-xl py-1 text-xs font-bold text-mutedMcp transition hover:text-white",
              active && "text-white"
            )}
          >
            <Icon size={20} fill={active ? "currentColor" : "none"} />
            <span>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
