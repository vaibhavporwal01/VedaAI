import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  icon?: ReactNode;
}

const variants: Record<ButtonVariant, string> = {
  primary:
    "bg-primary text-white shadow-soft hover:bg-[#2B2B2B] active:bg-black disabled:bg-disabled disabled:text-white/70",
  secondary:
    "border border-line bg-white text-ink hover:bg-soft active:bg-[#F0F0F0] disabled:bg-[#F0F0F0] disabled:text-disabled",
  ghost: "bg-transparent text-ink hover:bg-soft active:bg-[#F0F0F0] disabled:text-disabled",
  danger: "bg-transparent text-brand hover:bg-brand/10 active:bg-brand/15 disabled:text-disabled"
};

export function Button({ className, variant = "primary", icon, children, ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        "focus-ring inline-flex min-h-[46px] items-center justify-center gap-2 rounded-full px-6 text-sm font-medium transition duration-150 disabled:shadow-none",
        variants[variant],
        className
      )}
      {...props}
    >
      {icon}
      {children}
    </button>
  );
}
