"use client";

import { useParams } from "next/navigation";
import { useAssignment } from "@/hooks/useAssignment";
import { useGeneration } from "@/hooks/useGeneration";
import { AppShell } from "@/components/layout/AppShell";
import { AIBanner } from "@/components/output/AIBanner";
import { QuestionPaper } from "@/components/output/QuestionPaper";
import { useProfileStore } from "@/features/profile/store";

export default function AssignmentOutputPage() {
  const params = useParams<{ id: string }>();
  const id = params.id;
  const { selected, isLoading, error } = useAssignment(id);
  const { job, isConnected } = useGeneration(id);
  const profile = useProfileStore();
  const paper = job?.questionPaper ?? selected?.questionPaper;

  return (
    <AppShell breadcrumb="Create New" backHref="/assignments/create">
      <section className="mx-auto max-w-[373px] space-y-3 pt-4 desktop:max-w-[1280px] desktop:pt-3">
        {selected ? (
          <AIBanner
            teacherName={profile.name}
            subject={selected.subject}
            grade={selected.grade}
            topic={selected.topic}
          />
        ) : null}

        {isLoading ? (
          <div className="rounded-[28px] bg-white p-8 text-center text-sm font-bold text-muted shadow-card">Loading question paper...</div>
        ) : error ? (
          <div className="rounded-[28px] bg-white p-8 text-center text-sm font-bold text-brand shadow-card">{error}</div>
        ) : paper ? (
          <div className="print-area">
            <QuestionPaper paper={{ ...paper, schoolName: profile.schoolName || paper.schoolName }} />
          </div>
        ) : (
          <div className="rounded-[28px] bg-white p-8 text-center shadow-card">
            <div className="mx-auto grid size-16 place-items-center rounded-2xl bg-primary text-white shadow-soft">
              <span className="size-8 animate-spin rounded-full border-4 border-white/30 border-t-white" />
            </div>
            <h1 className="mt-5 text-xl font-bold text-ink">Generating question paper</h1>
            <p className="mx-auto mt-2 max-w-[520px] text-sm leading-6 text-muted">
              {job?.stage ?? "Your assignment is queued. The paper will appear here automatically."}
            </p>
            <div className="mx-auto mt-6 h-2 max-w-[360px] overflow-hidden rounded-full bg-soft">
              <span className="block h-full w-1/2 animate-pulse rounded-full bg-brand" />
            </div>
            <p className="mt-4 text-xs font-medium text-muted">
              {isConnected ? "Live updates connected" : "WebSocket disconnected. Polling every 3 seconds."}
            </p>
            {job?.status === "failed" ? <p className="mt-4 text-sm font-bold text-brand">{job.error}</p> : null}
          </div>
        )}
      </section>
    </AppShell>
  );
}
