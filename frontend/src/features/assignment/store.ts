"use client";

import { create } from "zustand";
import { api } from "@/services/api";
import type { Assignment } from "@/types";

interface AssignmentStore {
  assignments: Assignment[];
  selected?: Assignment;
  isLoading: boolean;
  error?: string;
  fetchAssignments: () => Promise<void>;
  fetchAssignment: (id: string) => Promise<void>;
  removeAssignment: (id: string) => Promise<void>;
}

export const useAssignmentStore = create<AssignmentStore>((set) => ({
  assignments: [],
  isLoading: false,
  fetchAssignments: async () => {
    set({ isLoading: true, error: undefined });
    try {
      const assignments = await api.listAssignments();
      set({ assignments, isLoading: false });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : "Unable to load assignments", isLoading: false });
    }
  },
  fetchAssignment: async (id) => {
    set({ isLoading: true, error: undefined, selected: undefined });
    try {
      const selected = await api.getAssignment(id);
      set((state) => ({
        selected,
        isLoading: false,
        assignments: state.assignments.some((assignment) => assignment.id === selected.id)
          ? state.assignments.map((assignment) => (assignment.id === selected.id ? selected : assignment))
          : [selected, ...state.assignments]
      }));
    } catch (error) {
      set({ error: error instanceof Error ? error.message : "Unable to load assignment", isLoading: false });
    }
  },
  removeAssignment: async (id) => {
    await api.deleteAssignment(id);
    set((state) => ({
      assignments: state.assignments.filter((assignment) => assignment.id !== id)
    }));
  }
}));
