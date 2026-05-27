import type { Assignment, AssignmentCreateResponse, JobState } from "@/types";
import { localAssignments } from "./localAssignments";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

class ApiRequestError extends Error {
  constructor(
    message: string,
    public status?: number
  ) {
    super(message);
    this.name = "ApiRequestError";
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    ...init,
    headers: init?.body instanceof FormData ? init.headers : { "Content-Type": "application/json", ...init?.headers }
  });

  if (!response.ok) {
    const error = (await response.json().catch(() => null)) as { error?: string } | null;
    throw new ApiRequestError(error?.error ?? `Request failed with ${response.status}`, response.status);
  }

  return response.json() as Promise<T>;
}

function shouldUseLocalFallback(error: unknown) {
  if (error instanceof ApiRequestError) {
    return error.status === undefined || error.status >= 500 || /redis|unavailable|queue/i.test(error.message);
  }

  return error instanceof TypeError || (error instanceof Error && /failed to fetch|network/i.test(error.message));
}

async function withLocalFallback<T>(remote: () => Promise<T>, local: () => T | undefined | null, missingMessage = "Local record not found"): Promise<T> {
  try {
    return await remote();
  } catch (error) {
    if (shouldUseLocalFallback(error)) {
      const result = local();
      if (result === undefined || result === null) {
        throw new Error(missingMessage);
      }
      return result;
    }
    throw error;
  }
}

export const api = {
  listAssignments: () => withLocalFallback(() => request<Assignment[]>("/api/assignments"), () => localAssignments.list()),
  getAssignment: (id: string) =>
    withLocalFallback(() => request<Assignment>(`/api/assignments/${id}`), () => localAssignments.get(id), "Assignment not found"),
  createAssignment: (data: FormData) =>
    withLocalFallback(
      () =>
        request<AssignmentCreateResponse>("/api/assignments", {
          method: "POST",
          body: data
        }),
      () => localAssignments.create(data)
    ),
  getStatus: (id: string) =>
    withLocalFallback(() => request<JobState>(`/api/assignments/${id}/status`), () => localAssignments.status(id), "Job state not found"),
  regenerate: (id: string) =>
    withLocalFallback(
      () =>
        request<AssignmentCreateResponse>(`/api/assignments/${id}/regenerate`, {
          method: "POST",
          body: JSON.stringify({})
        }),
      () => localAssignments.regenerate(id)
    ),
  deleteAssignment: (id: string) =>
    withLocalFallback(
      () =>
        request<{ ok: true }>(`/api/assignments/${id}`, {
          method: "DELETE"
        }),
      () => {
        localAssignments.delete(id);
        return { ok: true as const };
      }
    ),
  generateToolkitDraft: (tool: string, topic: string) =>
    request<{ lines: string[] }>("/api/toolkit", {
      method: "POST",
      body: JSON.stringify({ tool, topic })
    })
};
