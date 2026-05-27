"use client";

import { useRouter } from "next/navigation";
import { Dropdown, DropdownItem } from "@/components/ui/Dropdown";
import { formatDate } from "@/lib/utils";
import type { Assignment } from "@/types";

interface AssignmentCardProps {
  assignment: Assignment;
  onDelete: (id: string) => Promise<void>;
}

export function AssignmentCard({ assignment, onDelete }: AssignmentCardProps) {
  const router = useRouter();

  return (
    <article className="relative h-[132px] rounded-[28px] bg-white p-5 shadow-card transition hover:-translate-y-0.5 hover:shadow-realistic desktop:h-[162px] desktop:rounded-[24px] desktop:p-6">
      <div className="flex items-start justify-between gap-3">
        <button
          type="button"
          className="focus-ring max-w-[260px] rounded text-left text-[26px] font-bold leading-none text-ink hover:underline desktop:max-w-[430px] desktop:text-2xl"
          onClick={() => router.push(`/assignments/${assignment.id}`)}
        >
          {assignment.title}
        </button>
        <Dropdown>
          <DropdownItem onClick={() => router.push(`/assignments/${assignment.id}`)}>View Assignment</DropdownItem>
          <DropdownItem danger onClick={() => onDelete(assignment.id)}>
            Delete
          </DropdownItem>
        </Dropdown>
      </div>
      <p className="mt-3 max-w-[260px] truncate text-sm font-medium text-mutedMcp desktop:max-w-[430px]">
        {assignment.subject} - {assignment.grade} - {assignment.topic}
      </p>
      <div className="absolute bottom-5 left-5 right-5 grid grid-cols-2 gap-3 text-[15px] leading-[19px] text-mutedMcp desktop:bottom-6 desktop:left-6 desktop:right-6 desktop:flex desktop:items-center desktop:justify-between desktop:text-sm">
        <p>
          <span className="font-bold text-ink">Assigned on : </span>
          {formatDate(assignment.createdAt)}
        </p>
        <p className="text-right">
          <span className="font-bold text-ink">Due : </span>
          {formatDate(assignment.dueDate)}
        </p>
      </div>
    </article>
  );
}
