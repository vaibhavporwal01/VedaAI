import type { AssignmentEntity, JobStateEntity, QuestionPaperEntity } from "../../domain/types.js";
import { AssignmentModel, JobStateModel, QuestionPaperModel } from "./models.js";

function mapAssignment(doc: any, questionPaper?: QuestionPaperEntity): AssignmentEntity & { questionPaper?: QuestionPaperEntity } {
  return {
    id: doc._id.toString(),
    title: doc.title,
    subject: doc.subject,
    grade: doc.grade,
    topic: doc.topic,
    dueDate: doc.dueDate,
    questionTypes: doc.questionTypes,
    fileUrl: doc.fileUrl,
    instructions: doc.instructions,
    timeAllowed: doc.timeAllowed,
    schoolName: doc.schoolName,
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
    questionPaper
  };
}

function mapPaper(doc: any): QuestionPaperEntity {
  return {
    id: doc._id.toString(),
    assignmentId: doc.assignmentId.toString(),
    schoolName: doc.schoolName,
    subject: doc.subject,
    grade: doc.grade,
    timeAllowed: doc.timeAllowed,
    maxMarks: doc.maxMarks,
    sections: doc.sections,
    generatedAt: doc.generatedAt
  };
}

function mapJob(doc: any): JobStateEntity {
  return {
    jobId: doc.jobId,
    assignmentId: doc.assignmentId.toString(),
    status: doc.status,
    stage: doc.stage,
    error: doc.error,
    timestamps: doc.timestamps
  };
}

export async function createAssignment(input: Omit<AssignmentEntity, "id" | "createdAt" | "updatedAt">) {
  const doc = await AssignmentModel.create(input);
  return mapAssignment(doc);
}

export async function listAssignments() {
  const docs = await AssignmentModel.find().sort({ createdAt: -1 });
  return docs.map((doc) => mapAssignment(doc));
}

export async function getAssignment(id: string) {
  const assignment = await AssignmentModel.findById(id);
  if (!assignment) {
    return null;
  }
  const paper = await QuestionPaperModel.findOne({ assignmentId: id }).sort({ generatedAt: -1 });
  return mapAssignment(assignment, paper ? mapPaper(paper) : undefined);
}

export async function deleteAssignment(id: string) {
  await Promise.all([
    AssignmentModel.findByIdAndDelete(id),
    QuestionPaperModel.deleteMany({ assignmentId: id }),
    JobStateModel.deleteMany({ assignmentId: id })
  ]);
}

export async function saveQuestionPaper(input: QuestionPaperEntity) {
  await QuestionPaperModel.deleteMany({ assignmentId: input.assignmentId });
  const doc = await QuestionPaperModel.create(input);
  return mapPaper(doc);
}

export async function upsertJobState(input: JobStateEntity) {
  const doc = await JobStateModel.findOneAndUpdate({ jobId: input.jobId }, input, { new: true, upsert: true });
  return mapJob(doc);
}

export async function getLatestJobState(assignmentId: string) {
  const doc = await JobStateModel.findOne({ assignmentId }).sort({ updatedAt: -1 });
  return doc ? mapJob(doc) : null;
}
