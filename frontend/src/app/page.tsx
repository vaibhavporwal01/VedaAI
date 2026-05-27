"use client";

import Link from "next/link";
import { ArrowRight, ClipboardList, Clock3, FileCheck2, Grid2X2, Plus } from "lucide-react";
import { useMemo } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/Button";
import { useAssignments } from "@/hooks/useAssignment";
import { formatDate } from "@/lib/utils";

export default function HomePage() {
  const { assignments, isLoading } = useAssignments();
  const readyCount = assignments.filter((assignment) => assignment.questionPaper).length;
  const pendingCount = assignments.length - readyCount;
  const latest = assignments.slice(0, 3);
  const dueSoon = useMemo(
    () =>
      assignments
        .filter((assignment) => new Date(assignment.dueDate).getTime() >= Date.now())
        .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
        .slice(0, 3),
    [assignments]
  );

  return (
    <AppShell breadcrumb="Home" backHref="/">
      <section className="mx-auto w-[calc(100vw-32px)] max-w-[373px] pt-6 desktop:w-auto desktop:max-w-[1280px] desktop:pt-9">
        <PageHeader title="Home" description="Track assignments, generated papers, and quick actions." icon={Grid2X2} />

        <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_360px]">
          <div className="rounded-[28px] bg-white p-5 shadow-card desktop:p-8">
            <div className="flex flex-col gap-5 desktop:flex-row desktop:items-center desktop:justify-between">
              <div>
                <p className="text-sm font-bold text-disabled">Workspace</p>
                <h1 className="mt-1 text-[30px] font-bold leading-tight text-ink desktop:text-3xl">Workspace Overview</h1>
                <p className="mt-2 max-w-[560px] text-base leading-6 text-mutedMcp">
                  Assignments, generated papers, groups, and upcoming classroom deadlines.
                </p>
              </div>
              <Link href="/assignments/create">
                <Button icon={<Plus size={20} />}>Create Assignment</Button>
              </Link>
            </div>

            <div className="mt-8 grid gap-3 desktop:grid-cols-3">
              {[
                { label: "Assignments", value: assignments.length, icon: ClipboardList },
                { label: "Ready Papers", value: readyCount, icon: FileCheck2 },
                { label: "Pending", value: pendingCount, icon: Clock3 }
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.label} className="rounded-[18px] bg-soft p-4">
                    <Icon size={22} className="text-ink" />
                    <p className="mt-4 text-3xl font-bold text-ink">{isLoading ? "-" : item.value}</p>
                    <p className="mt-1 text-sm font-bold text-mutedMcp">{item.label}</p>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="rounded-[24px] bg-primary p-5 text-white shadow-card desktop:p-6">
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm font-bold text-white/70">Next Due</p>
              <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-bold text-white/70">{dueSoon.length} upcoming</span>
            </div>
            <div className="mt-5 grid gap-3">
              {dueSoon.length > 0 ? (
                dueSoon.map((assignment) => (
                  <Link key={assignment.id} href={`/assignments/${assignment.id}`} className="block rounded-[16px] bg-white/10 p-4 ring-1 ring-white/5 hover:bg-white/15">
                    <p className="truncate text-base font-bold">{assignment.title}</p>
                    <p className="mt-1 text-sm text-white/70">{formatDate(assignment.dueDate)}</p>
                  </Link>
                ))
              ) : (
                <p className="text-sm leading-6 text-white/70">No upcoming due dates yet.</p>
              )}
            </div>
          </div>
        </div>

        <div className="mt-5 rounded-[28px] bg-white p-5 shadow-card desktop:p-6">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-xl font-bold text-ink">Recent Assignments</h2>
            <Link href="/assignments" className="focus-ring flex items-center gap-2 rounded-full px-3 py-2 text-sm font-bold text-ink hover:bg-soft">
              View All <ArrowRight size={16} />
            </Link>
          </div>
          <div className="mt-5 grid gap-3 desktop:grid-cols-3">
            {latest.length > 0 ? (
              latest.map((assignment) => (
                <Link key={assignment.id} href={`/assignments/${assignment.id}`} className="rounded-[18px] bg-soft p-4 hover:bg-[#EDEDED]">
                  <p className="truncate text-base font-bold text-ink">{assignment.title}</p>
                  <p className="mt-2 truncate text-sm text-mutedMcp">{assignment.subject} - {assignment.topic}</p>
                  <p className="mt-4 text-sm font-bold text-ink">{formatDate(assignment.createdAt)}</p>
                </Link>
              ))
            ) : (
              <div className="rounded-[18px] bg-soft p-4 text-sm font-bold text-mutedMcp desktop:col-span-3">
                No assignments yet.
              </div>
            )}
          </div>
        </div>
      </section>
    </AppShell>
  );
}
