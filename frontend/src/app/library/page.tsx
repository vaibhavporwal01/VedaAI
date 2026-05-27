"use client";

import Link from "next/link";
import { BookOpenCheck, FileText, Library, Search } from "lucide-react";
import { useMemo, useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { PageHeader } from "@/components/layout/PageHeader";
import { MobileTitle } from "@/components/layout/Topbar";
import { Input } from "@/components/ui/Input";
import { useAssignments } from "@/hooks/useAssignment";
import { formatDate } from "@/lib/utils";

const templates = [
  { id: "t-1", title: "Balanced Question Paper", type: "Template", meta: "MCQ, short, long answer" },
  { id: "t-2", title: "Two-Marks Answer Key", type: "Template", meta: "Concise marking points" },
  { id: "t-3", title: "Class Test Rubric", type: "Rubric", meta: "Accuracy, clarity, steps" },
  { id: "t-4", title: "DSA Revision Worksheet", type: "Worksheet", meta: "Stacks, queues, search basics" },
  { id: "t-5", title: "Parent Feedback Notes", type: "Notes", meta: "Strengths, gaps, next practice" }
];

export default function LibraryPage() {
  const { assignments } = useAssignments();
  const [query, setQuery] = useState("");
  const papers = useMemo(
    () =>
      assignments
        .filter((assignment) => assignment.questionPaper)
        .filter((assignment) => [assignment.title, assignment.subject, assignment.topic].join(" ").toLowerCase().includes(query.toLowerCase())),
    [assignments, query]
  );
  const filteredTemplates = templates.filter((template) =>
    [template.title, template.type, template.meta].join(" ").toLowerCase().includes(query.toLowerCase())
  );

  return (
    <AppShell breadcrumb="My Library" backHref="/">
      <MobileTitle title="Library" backHref="/" />
      <section className="mx-auto w-[calc(100vw-32px)] max-w-[373px] pt-6 desktop:w-auto desktop:max-w-[1280px] desktop:pt-9">
        <PageHeader title="My Library" description="Generated papers and reusable classroom formats." icon={Library} />

        <div className="rounded-[28px] bg-white p-5 shadow-card desktop:p-6">
          <div className="flex flex-col gap-4 desktop:flex-row desktop:items-center desktop:justify-between">
            <h1 className="text-xl font-bold text-ink">Saved Material</h1>
            <div className="relative desktop:w-[380px]">
              <Search className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-disabled" size={20} />
              <Input className="pl-12" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search library" />
            </div>
          </div>

          <div className="mt-6 grid gap-4 desktop:grid-cols-2">
            {papers.map((assignment) => (
              <Link key={assignment.id} href={`/assignments/${assignment.id}`} className="rounded-[22px] bg-soft p-4 hover:bg-[#EDEDED]">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate text-lg font-bold text-ink">{assignment.title}</p>
                    <p className="mt-1 truncate text-sm text-mutedMcp">{assignment.subject} - {assignment.topic}</p>
                  </div>
                  <span className="grid size-10 shrink-0 place-items-center rounded-full bg-white text-ink">
                    <FileText size={20} />
                  </span>
                </div>
                <p className="mt-5 text-sm font-bold text-ink">{formatDate(assignment.questionPaper?.generatedAt ?? assignment.createdAt)}</p>
              </Link>
            ))}

            {filteredTemplates.map((template) => (
              <article key={template.id} className="rounded-[22px] bg-soft p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-lg font-bold text-ink">{template.title}</p>
                    <p className="mt-1 text-sm text-mutedMcp">{template.meta}</p>
                  </div>
                  <span className="grid size-10 shrink-0 place-items-center rounded-full bg-white text-ink">
                    <BookOpenCheck size={20} />
                  </span>
                </div>
                <p className="mt-5 text-sm font-bold text-ink">{template.type}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </AppShell>
  );
}
