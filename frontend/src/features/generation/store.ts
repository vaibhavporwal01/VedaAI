"use client";

import { create } from "zustand";
import type { JobState } from "@/types";

interface GenerationStore {
  jobs: Record<string, JobState>;
  setJob: (state: JobState) => void;
  clearJob: (assignmentId: string) => void;
}

export const useGenerationStore = create<GenerationStore>((set) => ({
  jobs: {},
  setJob: (job) =>
    set((state) => ({
      jobs: {
        ...state.jobs,
        [job.assignmentId]: job
      }
    })),
  clearJob: (assignmentId) =>
    set((state) => {
      const jobs = { ...state.jobs };
      delete jobs[assignmentId];
      return { jobs };
    })
}));
