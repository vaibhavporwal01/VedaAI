import type { LucideIcon } from "lucide-react";

interface PageHeaderProps {
  title: string;
  description: string;
  icon: LucideIcon;
}

export function PageHeader({ title, description, icon: Icon }: PageHeaderProps) {
  return (
    <div className="mb-6 hidden items-start gap-4 desktop:flex">
      <span className="mt-2 grid size-10 place-items-center rounded-xl bg-white text-ink shadow-soft">
        <Icon size={20} />
      </span>
      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-xl font-bold text-ink">{title}</h1>
        </div>
        <p className="mt-1 text-sm text-disabled">{description}</p>
      </div>
    </div>
  );
}
