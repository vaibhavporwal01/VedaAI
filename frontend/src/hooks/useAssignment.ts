"use client";

import { useEffect } from "react";
import { useAssignmentStore } from "@/features/assignment/store";

export function useAssignments() {
  const assignments = useAssignmentStore((state) => state.assignments);
  const isLoading = useAssignmentStore((state) => state.isLoading);
  const error = useAssignmentStore((state) => state.error);
  const fetchAssignments = useAssignmentStore((state) => state.fetchAssignments);
  const removeAssignment = useAssignmentStore((state) => state.removeAssignment);

  useEffect(() => {
    fetchAssignments();
  }, [fetchAssignments]);

  return { assignments, isLoading, error, fetchAssignments, removeAssignment };
}

export function useAssignment(id: string) {
  const selected = useAssignmentStore((state) => state.selected);
  const isLoading = useAssignmentStore((state) => state.isLoading);
  const error = useAssignmentStore((state) => state.error);
  const fetchAssignment = useAssignmentStore((state) => state.fetchAssignment);

  useEffect(() => {
    if (id) {
      fetchAssignment(id);
    }
  }, [id, fetchAssignment]);

  return { selected, isLoading, error, fetchAssignment };
}
