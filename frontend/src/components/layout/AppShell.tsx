import type { ReactNode } from "react";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";
import { MobileNav } from "./MobileNav";

interface AppShellProps {
  children: ReactNode;
  breadcrumb?: string;
  backHref?: string;
  topbarIcon?: "grid";
}

export function AppShell({ children, breadcrumb = "Assignment", backHref, topbarIcon }: AppShellProps) {
  return (
    <div className="min-h-screen overflow-x-hidden bg-page desktop:p-3">
      <div className="desktop:flex desktop:gap-[11px]">
        <Sidebar />
        <main className="min-w-0 flex-1 pb-32 desktop:mx-0 desktop:w-full desktop:pb-6">
          <Topbar breadcrumb={breadcrumb} backHref={backHref} icon={topbarIcon} />
          {children}
        </main>
      </div>
      <MobileNav />
    </div>
  );
}
