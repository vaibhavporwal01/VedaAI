"use client";

import { useAssignments } from "@/hooks/useAssignment";
import { AppShell } from "@/components/layout/AppShell";
import { MobileTitle } from "@/components/layout/Topbar";
import { EmptyAssignments } from "@/components/assignment/EmptyAssignments";
import { AssignmentGrid } from "@/components/assignment/AssignmentGrid";

export default function AssignmentsPage() {
  const { assignments, isLoading, error, removeAssignment } = useAssignments();
  const hasAssignments = assignments.length > 0;

  return (
    <AppShell breadcrumb="Assignment">
      {hasAssignments ? <MobileTitle title="Assignments" /> : null}
      {isLoading ? (
        <div className="mx-auto mt-24 max-w-[373px] rounded-[24px] bg-white p-6 text-center text-sm font-bold text-muted desktop:max-w-[1280px]">
          Loading assignments...
        </div>
      ) : error ? (
        <div className="mx-auto mt-24 max-w-[373px] rounded-[24px] bg-white p-6 text-center text-sm font-bold text-brand desktop:max-w-[1280px]">
          {error}
        </div>
      ) : hasAssignments ? (
        <AssignmentGrid assignments={assignments} onDelete={removeAssignment} />
      ) : (
        <EmptyAssignments />
      )}
    </AppShell>
  );
}
