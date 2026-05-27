"use client";

import { Bell, CalendarClock, CheckCircle2, ChevronDown, Clock3, Grid2X2, Menu, MoveLeft } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Logo } from "./Logo";
import { cn, formatDate } from "@/lib/utils";
import { useProfileStore } from "@/features/profile/store";
import { useAssignmentStore } from "@/features/assignment/store";
import type { Assignment } from "@/types";

interface TopbarProps {
  breadcrumb: string;
  backHref?: string;
  icon?: "grid";
}

export function Topbar({ breadcrumb, backHref = "/assignments" }: TopbarProps) {
  const profile = useProfileStore();

  return (
    <>
      <header className="no-print hidden h-14 items-center justify-between rounded-2xl bg-white/80 px-6 shadow-soft backdrop-blur desktop:flex">
        <div className="flex min-w-0 items-center gap-3">
          <Link
            href={backHref}
            className="focus-ring grid size-10 place-items-center rounded-full bg-white text-ink transition hover:bg-soft"
            aria-label="Go back"
          >
            <MoveLeft size={24} />
          </Link>
          <Grid2X2 className="text-disabled" size={20} />
          <span className="truncate text-sm font-bold text-disabled">{breadcrumb}</span>
        </div>
        <div className="flex items-center gap-3">
          <NotificationMenu buttonClassName="bg-white hover:bg-soft" />
          <button className="focus-ring flex h-11 items-center gap-2 rounded-full bg-white px-3 font-bold text-ink hover:bg-soft" type="button">
            <span className="grid size-8 shrink-0 place-items-center rounded-full bg-[#FFE1D8] text-xs font-black text-ink ring-1 ring-line">{profile.initials}</span>
            <span className="max-w-[170px] truncate text-sm">{profile.name}</span>
            <ChevronDown size={20} />
          </button>
        </div>
      </header>

      <header className="no-print desktop:hidden">
        <div className="mx-auto mt-3 flex h-14 w-[calc(100vw-32px)] max-w-[373px] items-center justify-between rounded-2xl bg-white px-3 shadow-soft">
          <Logo compact />
          <div className="flex items-center gap-3">
            <NotificationMenu buttonClassName="bg-soft" />
            <span className="grid size-8 place-items-center rounded-full bg-[#FFE1D8] text-xs font-black text-ink ring-1 ring-line">{profile.initials}</span>
            <button className="focus-ring grid size-8 place-items-center rounded-full text-ink" type="button" aria-label="Menu">
              <Menu size={24} />
            </button>
          </div>
        </div>
      </header>
    </>
  );
}

function buildNotifications(assignments: Assignment[]) {
  const now = new Date();
  const nextWeek = new Date(now);
  nextWeek.setDate(now.getDate() + 7);

  const dueSoon = assignments
    .filter((assignment) => {
      const due = new Date(assignment.dueDate);
      return due.getTime() >= now.getTime() && due.getTime() <= nextWeek.getTime();
    })
    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
    .slice(0, 2)
    .map((assignment) => ({
      id: `due-${assignment.id}`,
      href: `/assignments/${assignment.id}`,
      title: assignment.title,
      detail: `Due ${formatDate(assignment.dueDate)}`,
      icon: CalendarClock
    }));

  const ready = assignments
    .filter((assignment) => assignment.questionPaper)
    .slice(0, 1)
    .map((assignment) => ({
      id: `ready-${assignment.id}`,
      href: `/assignments/${assignment.id}`,
      title: assignment.title,
      detail: "Question paper ready",
      icon: CheckCircle2
    }));

  const pendingCount = assignments.filter((assignment) => !assignment.questionPaper).length;
  const pending =
    pendingCount > 0
      ? [
          {
            id: "pending",
            href: "/assignments",
            title: `${pendingCount} paper${pendingCount === 1 ? "" : "s"} pending`,
            detail: "Open assignments to review progress",
            icon: Clock3
          }
        ]
      : [];

  return [...dueSoon, ...ready, ...pending].slice(0, 4);
}

function NotificationMenu({ buttonClassName }: { buttonClassName?: string }) {
  const [open, setOpen] = useState(false);
  const assignments = useAssignmentStore((state) => state.assignments);
  const fetchAssignments = useAssignmentStore((state) => state.fetchAssignments);
  const notifications = useMemo(() => buildNotifications(assignments), [assignments]);

  useEffect(() => {
    if (assignments.length === 0) {
      void fetchAssignments();
    }
  }, [assignments.length, fetchAssignments]);

  return (
    <div className="relative">
      <button
        className={cn("focus-ring relative grid size-9 place-items-center rounded-full text-ink", buttonClassName)}
        type="button"
        aria-label="Notifications"
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
      >
        <Bell size={22} />
        {notifications.length > 0 ? (
          <span className="absolute -right-1 -top-1 grid min-w-5 place-items-center rounded-full bg-brand px-1 text-[10px] font-black leading-5 text-white">
            {notifications.length}
          </span>
        ) : null}
      </button>

      {open ? (
        <div className="absolute right-0 top-12 z-40 w-[min(320px,calc(100vw-32px))] rounded-[20px] bg-white p-3 shadow-realistic ring-1 ring-black/5">
          <div className="flex items-center justify-between px-2 pb-2">
            <p className="text-sm font-bold text-ink">Notifications</p>
            <button className="rounded-full px-2 py-1 text-xs font-bold text-mutedMcp hover:bg-soft" type="button" onClick={() => setOpen(false)}>
              Close
            </button>
          </div>

          <div className="space-y-2">
            {notifications.length > 0 ? (
              notifications.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.id}
                    href={item.href}
                    className="flex gap-3 rounded-[16px] bg-soft p-3 transition hover:bg-[#E7E7E7]"
                    onClick={() => setOpen(false)}
                  >
                    <span className="grid size-9 shrink-0 place-items-center rounded-full bg-white text-ink">
                      <Icon size={18} />
                    </span>
                    <span className="min-w-0">
                      <span className="block truncate text-sm font-bold text-ink">{item.title}</span>
                      <span className="mt-1 block truncate text-xs font-medium text-mutedMcp">{item.detail}</span>
                    </span>
                  </Link>
                );
              })
            ) : (
              <div className="rounded-[16px] bg-soft p-4 text-sm font-bold text-mutedMcp">All caught up.</div>
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
}

interface MobileTitleProps {
  title: string;
  backHref?: string;
  className?: string;
}

export function MobileTitle({ title, backHref = "/assignments", className }: MobileTitleProps) {
  return (
    <div className={cn("mx-auto mt-7 flex max-w-[373px] items-center", className)}>
      <Link href={backHref} className="focus-ring grid size-12 place-items-center rounded-full bg-white/60 text-ink hover:bg-white" aria-label="Go back">
        <MoveLeft size={24} />
      </Link>
      <h1 className="flex-1 pr-12 text-center text-xl font-bold text-ink">{title}</h1>
    </div>
  );
}
