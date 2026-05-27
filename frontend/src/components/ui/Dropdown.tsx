"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { MoreVertical } from "lucide-react";
import { Button } from "./Button";
import { cn } from "@/lib/utils";

interface DropdownProps {
  children: ReactNode;
  align?: "left" | "right";
}

export function Dropdown({ children, align = "right" }: DropdownProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const close = (event: MouseEvent) => {
      if (!ref.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  return (
    <div ref={ref} className="relative">
      <Button
        variant="ghost"
        aria-label="Open menu"
        className="min-h-10 w-10 px-0 text-muted hover:text-ink"
        onClick={() => setOpen((value) => !value)}
      >
        <MoreVertical size={24} />
      </Button>
      {open ? (
        <div
          className={cn(
            "absolute top-11 z-20 w-[140px] rounded-xl bg-white p-2 shadow-soft",
            align === "right" ? "right-0" : "left-0"
          )}
        >
          {children}
        </div>
      ) : null}
    </div>
  );
}

interface DropdownItemProps {
  children: ReactNode;
  danger?: boolean;
  onClick?: () => void;
}

export function DropdownItem({ children, danger, onClick }: DropdownItemProps) {
  return (
    <button
      className={cn(
        "focus-ring flex h-8 w-full items-center rounded-lg px-2 text-left text-sm font-medium text-ink hover:bg-soft",
        danger && "text-brand hover:bg-brand/10"
      )}
      onClick={onClick}
      type="button"
    >
      {children}
    </button>
  );
}
