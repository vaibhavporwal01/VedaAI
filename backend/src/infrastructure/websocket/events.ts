import type { JobStateEntity, QuestionPaperEntity } from "../../domain/types.js";
import { getRedis } from "../cache/redis.js";

export type JobEventName = "job:queued" | "job:processing" | "job:done" | "job:failed";

export interface JobEventPayload extends JobStateEntity {
  questionPaper?: QuestionPaperEntity;
}

export interface JobEvent {
  type: JobEventName;
  payload: JobEventPayload;
}

export const JOB_EVENTS_CHANNEL = "vedaai:job-events";

export async function publishJobEvent(type: JobEventName, payload: JobEventPayload) {
  await getRedis().publish(JOB_EVENTS_CHANNEL, JSON.stringify({ type, payload }));
}
