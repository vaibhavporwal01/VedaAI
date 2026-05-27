"use client";

import { FileText, Plus, Search, SlidersHorizontal } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { AssignmentCard } from "./AssignmentCard";
import type { Assignment } from "@/types";

interface AssignmentGridProps {
  assignments: Assignment[];
  onDelete: (id: string) => Promise<void>;
}

export function AssignmentGrid({ assignments, onDelete }: AssignmentGridProps) {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<"all" | "ready" | "pending">("all");
  const filtered = useMemo(() => {
    const normalizedQuery = query.toLowerCase().trim();
    return assignments.filter((assignment) => {
      const matchesQuery = [assignment.title, assignment.subject, assignment.grade, assignment.topic]
        .join(" ")
        .toLowerCase()
        .includes(normalizedQuery);
      const matchesFilter =
        filter === "all" || (filter === "ready" && assignment.questionPaper) || (filter === "pending" && !assignment.questionPaper);
      return matchesQuery && matchesFilter;
    });
  }, [assignments, filter, query]);

  const nextFilter = () => {
    setFilter((value) => (value === "all" ? "ready" : value === "ready" ? "pending" : "all"));
  };

  return (
    <section className="mx-auto w-[calc(100vw-32px)] max-w-[373px] px-0 pt-6 desktop:w-auto desktop:max-w-none desktop:pt-9">
      <div className="mb-9 hidden items-start gap-4 desktop:flex">
        <span className="mt-2 grid size-10 place-items-center rounded-xl bg-white text-ink shadow-soft">
          <FileText size={20} />
        </span>
        <div>
          <h1 className="text-xl font-bold text-ink">Assignments</h1>
          <p className="mt-1 text-sm text-disabled">Manage and create assignments for your classes.</p>
        </div>
      </div>

      <div className="mb-6 flex h-16 items-center rounded-[18px] bg-white px-4 shadow-soft desktop:mb-4 desktop:w-full">
        <button className="focus-ring flex items-center gap-2 rounded-full text-sm font-bold text-disabled hover:text-ink" type="button" onClick={nextFilter}>
          <SlidersHorizontal size={20} />
          <span className="desktop:hidden">{filter === "all" ? "Filter" : filter}</span>
          <span className="hidden desktop:inline">{filter === "all" ? "Filter By" : filter === "ready" ? "Ready Papers" : "Pending Papers"}</span>
        </button>
        <div className="ml-auto w-[228px] desktop:w-[380px]">
          <div className="relative">
            <Search className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-disabled" size={20} />
            <Input
              aria-label="Search assignment"
              className="pl-12 text-base desktop:text-sm"
              placeholder="Search Assignment"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="grid gap-5 desktop:w-full desktop:grid-cols-2 desktop:gap-x-3 desktop:gap-y-4">
        {filtered.map((assignment) => (
          <AssignmentCard key={assignment.id} assignment={assignment} onDelete={onDelete} />
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-[24px] bg-white p-6 text-center text-sm font-bold text-mutedMcp shadow-card desktop:w-full">
          No assignments match this view.
        </div>
      ) : null}

      <Link href="/assignments/create" className="fixed bottom-[112px] right-6 z-20 desktop:hidden" aria-label="Create assignment">
        <span className="focus-ring grid size-12 place-items-center rounded-full bg-white text-brand shadow-realistic transition hover:bg-soft">
          <Plus size={28} />
        </span>
      </Link>

      <Link href="/assignments/create" className="fixed bottom-7 left-1/2 z-20 hidden -translate-x-1/2 desktop:block">
        <Button className="h-[46px] min-w-[208px] text-sm font-bold" icon={<Plus size={20} />}>
          Create Assignment
        </Button>
      </Link>
    </section>
  );
}
