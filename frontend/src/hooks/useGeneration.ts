"use client";

import { useEffect } from "react";
import { api } from "@/services/api";
import { useGenerationStore } from "@/features/generation/store";
import { useSocket } from "./useSocket";

export function useGeneration(assignmentId: string) {
  const { isConnected } = useSocket();
  const job = useGenerationStore((state) => state.jobs[assignmentId]);
  const setJob = useGenerationStore((state) => state.setJob);

  useEffect(() => {
    if (!assignmentId || isConnected || job?.status === "done" || job?.status === "failed") {
      return;
    }

    const poll = async () => {
      try {
        const state = await api.getStatus(assignmentId);
        setJob(state);
      } catch {
        setJob({
          assignmentId,
          jobId: "poll-fallback",
          status: "failed",
          stage: "Unable to reach status service",
          error: "WebSocket disconnected and polling failed."
        });
      }
    };

    poll();
    const interval = window.setInterval(poll, 3000);
    return () => window.clearInterval(interval);
  }, [assignmentId, isConnected, job?.status, setJob]);

  return { job, isConnected };
}
