import { Router } from "express";
import multer from "multer";
import { ZodError } from "zod";
import { createAssignmentSchema } from "../domain/schemas.js";
import { logger } from "../config/logger.js";
import { assertRedisReady, getCachedJson, getRedis, removeCache } from "../infrastructure/cache/redis.js";
import { getAssignmentQueue } from "../infrastructure/queue/assignmentQueue.js";
import {
  createAssignment,
  deleteAssignment,
  getAssignment,
  getLatestJobState,
  listAssignments,
  upsertJobState
} from "../infrastructure/db/repositories.js";
import { publishJobEvent } from "../infrastructure/websocket/events.js";
import type { JobEventPayload } from "../infrastructure/websocket/events.js";
import type { QuestionPaperEntity } from "../domain/types.js";

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const allowed = ["image/png", "image/jpeg", "application/pdf"];
    if (!allowed.includes(file.mimetype)) {
      cb(new Error("Only PNG, JPG, or PDF files are allowed"));
      return;
    }
    cb(null, true);
  }
});

export const assignmentsRouter = Router();

function parseQuestionTypes(raw: unknown) {
  if (typeof raw !== "string") {
    return raw;
  }

  return JSON.parse(raw);
}

async function persistAndPublishQueued(jobId: string, assignmentId: string) {
  const state = await upsertJobState({
    jobId,
    assignmentId,
    status: "queued",
    stage: "Queued for generation",
    timestamps: { queuedAt: new Date() }
  });
  await getRedis().set(`job:${assignmentId}`, JSON.stringify(state), "EX", 3600);
  await publishJobEvent("job:queued", state);
  return state;
}

function sendValidationError(res: any, error: unknown) {
  if (error instanceof ZodError) {
    res.status(400).json({ error: error.issues.map((issue) => issue.message).join(", ") });
    return true;
  }
  return false;
}

assignmentsRouter.post("/", upload.single("file"), async (req, res) => {
  try {
    await assertRedisReady();
    const input = createAssignmentSchema.parse({
      ...req.body,
      questionTypes: parseQuestionTypes(req.body.questionTypes)
    });

    const assignment = await createAssignment({
      title: input.title,
      subject: input.subject,
      grade: input.grade,
      topic: input.topic,
      dueDate: new Date(input.dueDate),
      questionTypes: input.questionTypes,
      fileUrl: req.file?.originalname,
      instructions: input.instructions,
      timeAllowed: input.timeAllowed,
      schoolName: input.schoolName
    });

    const queue = getAssignmentQueue();
    const job = await queue.add(
      "generate-paper",
      { assignmentId: assignment.id },
      {
        attempts: 3,
        backoff: { type: "exponential", delay: 3000 },
        removeOnComplete: 100,
        removeOnFail: 100
      }
    );
    const jobId = job.id ?? assignment.id;
    await persistAndPublishQueued(jobId, assignment.id);
    res.status(201).json({ id: assignment.id, jobId });
  } catch (error) {
    if (sendValidationError(res, error)) {
      return;
    }
    if (error instanceof Error && error.message === "Redis unavailable") {
      res.status(503).json({ error: "Redis unavailable. Queue service is temporarily unavailable." });
      return;
    }
    logger.error("Create assignment failed", error);
    res.status(500).json({ error: "Unable to create assignment" });
  }
});

assignmentsRouter.get("/", async (_req, res) => {
  try {
    res.json(await listAssignments());
  } catch (error) {
    logger.error("List assignments failed", error);
    res.status(500).json({ error: "Unable to list assignments" });
  }
});

assignmentsRouter.get("/:id", async (req, res) => {
  try {
    const assignment = await getAssignment(req.params.id);
    if (!assignment) {
      res.status(404).json({ error: "Assignment not found" });
      return;
    }

    try {
      const cachedPaper = await getCachedJson<QuestionPaperEntity>(`paper:${req.params.id}`);
      if (cachedPaper) {
        res.json({ ...assignment, questionPaper: cachedPaper });
        return;
      }
    } catch (error) {
      logger.warn("Paper cache unavailable; falling back to MongoDB", error);
    }

    res.json(assignment);
  } catch (error) {
    logger.error("Get assignment failed", error);
    res.status(500).json({ error: "Unable to load assignment" });
  }
});

assignmentsRouter.get("/:id/status", async (req, res) => {
  try {
    await assertRedisReady();
    const cached = await getCachedJson<JobEventPayload>(`job:${req.params.id}`);
    if (cached) {
      res.json(cached);
      return;
    }
    const state = await getLatestJobState(req.params.id);
    if (!state) {
      res.status(404).json({ error: "Job state not found" });
      return;
    }
    res.json(state);
  } catch (error) {
    if (error instanceof Error && error.message === "Redis unavailable") {
      res.status(503).json({ error: "Redis unavailable. Polling is temporarily unavailable." });
      return;
    }
    logger.error("Get job status failed", error);
    res.status(500).json({ error: "Unable to load job status" });
  }
});

assignmentsRouter.post("/:id/regenerate", async (req, res) => {
  try {
    await assertRedisReady();
    const assignment = await getAssignment(req.params.id);
    if (!assignment) {
      res.status(404).json({ error: "Assignment not found" });
      return;
    }
    const queue = getAssignmentQueue();
    const job = await queue.add("generate-paper", { assignmentId: req.params.id }, { attempts: 3 });
    const jobId = job.id ?? req.params.id;
    await persistAndPublishQueued(jobId, req.params.id);
    res.json({ id: req.params.id, jobId });
  } catch (error) {
    if (error instanceof Error && error.message === "Redis unavailable") {
      res.status(503).json({ error: "Redis unavailable. Queue service is temporarily unavailable." });
      return;
    }
    logger.error("Regenerate assignment failed", error);
    res.status(500).json({ error: "Unable to regenerate assignment" });
  }
});

assignmentsRouter.delete("/:id", async (req, res) => {
  try {
    await deleteAssignment(req.params.id);
    await Promise.allSettled([removeCache(`paper:${req.params.id}`), removeCache(`job:${req.params.id}`)]);
    res.json({ ok: true });
  } catch (error) {
    logger.error("Delete assignment failed", error);
    res.status(500).json({ error: "Unable to delete assignment" });
  }
});

assignmentsRouter.use((error: unknown, _req: any, res: any, _next: any) => {
  if (error instanceof multer.MulterError) {
    res.status(400).json({ error: error.code === "LIMIT_FILE_SIZE" ? "File must be 10MB or less" : error.message });
    return;
  }
  if (error instanceof Error) {
    res.status(400).json({ error: error.message });
    return;
  }
  res.status(500).json({ error: "Unexpected upload error" });
});
