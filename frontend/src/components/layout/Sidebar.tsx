"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { BookOpen, FileText, Grid2X2, Images, Library, Plus, Settings } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { useAssignmentStore } from "@/features/assignment/store";
import { useProfileStore } from "@/features/profile/store";
import { cn } from "@/lib/utils";
import { Logo } from "./Logo";

const navItems = [
  { href: "/", label: "Home", icon: Grid2X2 },
  { href: "/groups", label: "My Groups", icon: Images },
  { href: "/assignments", label: "Assignments", icon: FileText, badgeKey: "assignments" },
  { href: "/toolkit", label: "Teacher's Toolkit", icon: BookOpen },
  { href: "/library", label: "My Library", icon: Library, badgeKey: "library" }
];

export function Sidebar() {
  const pathname = usePathname();
  const assignments = useAssignmentStore((state) => state.assignments);
  const fetchAssignments = useAssignmentStore((state) => state.fetchAssignments);
  const profile = useProfileStore();
  const assignmentCount = assignments.length;
  const libraryCount = assignments.filter((assignment) => assignment.questionPaper).length;

  useEffect(() => {
    if (assignments.length === 0) {
      void fetchAssignments();
    }
  }, [assignments.length, fetchAssignments]);

  return (
    <aside className="no-print hidden w-[304px] shrink-0 rounded-[18px] bg-white p-6 shadow-realistic desktop:sticky desktop:top-3 desktop:flex desktop:max-h-[calc(100vh-24px)] desktop:min-h-[calc(100vh-24px)] desktop:flex-col">
      <div className="shrink-0">
        <Logo />
        <Link href="/assignments/create" className="mt-14 block">
          <Button
            className="h-[42px] w-full border-4 border-orangeButton px-6 font-bold shadow-[inset_0_-14px_28px_rgba(255,255,255,0.08)]"
            icon={<Plus size={20} />}
          >
            Create Assignment
          </Button>
        </Link>
      </div>

      <nav className="mt-12 flex-1 space-y-2 overflow-y-auto pr-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = item.href === "/assignments" ? pathname.startsWith("/assignments") : pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "focus-ring flex h-10 items-center gap-3 rounded-lg px-3 text-sm font-medium text-mutedMcp transition hover:bg-soft hover:text-ink",
                active && "bg-soft font-bold text-ink"
              )}
            >
              <Icon size={20} />
              <span className="flex-1">{item.label}</span>
              {item.badgeKey === "assignments" && assignmentCount > 0 ? <Badge>{assignmentCount}</Badge> : null}
              {item.badgeKey === "library" && libraryCount > 0 ? <Badge>{libraryCount}</Badge> : null}
            </Link>
          );
        })}
      </nav>

      <div className="mt-5 shrink-0">
        <Link
          href="/settings"
          className="focus-ring flex h-10 items-center gap-3 rounded-lg px-3 text-sm font-medium text-mutedMcp hover:bg-soft hover:text-ink"
        >
          <Settings size={20} />
          Settings
        </Link>
        <div className="mt-2 flex min-h-20 items-center gap-3 rounded-2xl bg-soft px-3 py-3">
          <div className="grid size-14 shrink-0 place-items-center rounded-full bg-[#FFE1D8] text-sm font-black text-ink ring-1 ring-white">
            {profile.schoolName
              .split(/\s+/)
              .filter(Boolean)
              .slice(0, 3)
              .map((word) => word[0])
              .join("")
              .toUpperCase()}
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-bold text-ink">{profile.schoolName}</p>
            <p className="truncate text-sm text-mutedMcp">{profile.schoolLocation}</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
