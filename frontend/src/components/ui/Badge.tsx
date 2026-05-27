import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export function Badge({ className, ...props }: HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={cn(
        "inline-flex min-w-8 items-center justify-center rounded-full bg-brand px-2 py-0.5 text-xs font-bold text-white",
        className
      )}
      {...props}
    />
  );
}
