import { cn } from "@/lib/utils";

interface LogoProps {
  compact?: boolean;
}

export function Logo({ compact }: LogoProps) {
  return (
    <div className="flex items-center gap-3">
      <div
        className={cn(
          "grid shrink-0 place-items-center rounded-xl bg-[linear-gradient(135deg,#ff7a18_0%,#ef4a24_28%,#242424_62%,#861923_100%)] text-white shadow-soft",
          compact ? "size-7 rounded-lg" : "size-10"
        )}
        aria-hidden="true"
      >
        <span className={cn("font-black leading-none", compact ? "text-[20px]" : "text-[30px]")}>V</span>
      </div>
      <span className={cn("font-bold text-ink", compact ? "text-[28px]" : "text-[30px] desktop:text-[28px]")}>VedaAI</span>
    </div>
  );
}
