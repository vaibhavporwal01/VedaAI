import { Worker } from "bullmq";
import { logger } from "../../config/logger.js";
import { generateQuestionPaper } from "../../application/generatePaper.js";
import { getAssignment } from "../db/repositories.js";
import { cacheJson, getBullConnectionOptions, getRedis } from "../cache/redis.js";
import { saveQuestionPaper, upsertJobState } from "../db/repositories.js";
import { publishJobEvent } from "../websocket/events.js";
import { assignmentQueueName } from "./assignmentQueue.js";

async function updateState(
  type: "job:processing" | "job:done" | "job:failed",
  jobId: string,
  assignmentId: string,
  stage: string,
  error?: string,
  questionPaper?: Awaited<ReturnType<typeof generateQuestionPaper>>
) {
  const status = type.replace("job:", "") as "processing" | "done" | "failed";
  const state = await upsertJobState({
    jobId,
    assignmentId,
    status,
    stage,
    error,
    timestamps: {
      [`${status}At`]: new Date()
    }
  });
  await getRedis().set(`job:${assignmentId}`, JSON.stringify({ ...state, questionPaper }), "EX", 3600);
  await publishJobEvent(type, { ...state, questionPaper });
}

export function startAssignmentWorker() {
  const worker = new Worker<{ assignmentId: string }>(
    assignmentQueueName,
    async (job) => {
      const assignmentId = job.data.assignmentId;
      await updateState("job:processing", job.id ?? "unknown", assignmentId, "Building structured prompt");
      const assignment = await getAssignment(assignmentId);
      if (!assignment) {
        throw new Error("Assignment not found");
      }

      await updateState("job:processing", job.id ?? "unknown", assignmentId, "Generating question paper with Gemini");
      const paper = await generateQuestionPaper(assignment);
      await updateState("job:processing", job.id ?? "unknown", assignmentId, "Saving generated question paper");
      const saved = await saveQuestionPaper(paper);
      await cacheJson(`paper:${assignmentId}`, saved, 3600);
      await updateState("job:done", job.id ?? "unknown", assignmentId, "Question paper ready", undefined, saved);
      return saved;
    },
    {
      connection: getBullConnectionOptions()
    }
  );

  worker.on("failed", async (job, error) => {
    const assignmentId = job?.data.assignmentId;
    logger.error("Assignment worker job failed", error);
    if (job?.id && assignmentId) {
      await updateState("job:failed", job.id, assignmentId, "Generation failed", error.message).catch((stateError) =>
        logger.error("Unable to persist failed job state", stateError)
      );
    }
  });

  worker.on("error", (error) => logger.error("Assignment worker error", error));
  logger.info("Assignment worker started");
  return worker;
}
