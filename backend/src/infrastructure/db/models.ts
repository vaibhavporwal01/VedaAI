import mongoose, { Schema } from "mongoose";

const questionTypeSchema = new Schema(
  {
    type: { type: String, required: true },
    count: { type: Number, required: true, min: 1, max: 50 },
    marks: { type: Number, required: true, min: 1 }
  },
  { _id: false }
);

const assignmentSchema = new Schema(
  {
    title: { type: String, required: true },
    subject: { type: String, required: true },
    grade: { type: String, required: true },
    topic: { type: String, required: true },
    dueDate: { type: Date, required: true },
    questionTypes: { type: [questionTypeSchema], required: true },
    fileUrl: String,
    instructions: { type: String, default: "" },
    timeAllowed: { type: String, required: true },
    schoolName: String
  },
  { timestamps: true }
);

const paperQuestionSchema = new Schema(
  {
    text: { type: String, required: true },
    difficulty: { type: String, enum: ["Easy", "Moderate", "Challenging"], required: true },
    marks: { type: Number, required: true },
    answer: { type: String, required: true }
  },
  { _id: false }
);

const paperSectionSchema = new Schema(
  {
    title: { type: String, required: true },
    heading: { type: String, required: true },
    instruction: { type: String, required: true },
    questions: { type: [paperQuestionSchema], required: true }
  },
  { _id: false }
);

const questionPaperSchema = new Schema(
  {
    assignmentId: { type: Schema.Types.ObjectId, ref: "Assignment", required: true, index: true },
    schoolName: { type: String, required: true },
    subject: { type: String, required: true },
    grade: { type: String, required: true },
    timeAllowed: { type: String, required: true },
    maxMarks: { type: Number, required: true },
    sections: { type: [paperSectionSchema], required: true },
    generatedAt: { type: Date, required: true }
  },
  { timestamps: true }
);

const jobStateSchema = new Schema(
  {
    jobId: { type: String, required: true, unique: true },
    assignmentId: { type: Schema.Types.ObjectId, ref: "Assignment", required: true, index: true },
    status: { type: String, enum: ["queued", "processing", "done", "failed"], required: true },
    stage: { type: String, required: true },
    error: String,
    timestamps: {
      queuedAt: Date,
      processingAt: Date,
      doneAt: Date,
      failedAt: Date
    }
  },
  { timestamps: true }
);

export const AssignmentModel = mongoose.model("Assignment", assignmentSchema);
export const QuestionPaperModel = mongoose.model("QuestionPaper", questionPaperSchema);
export const JobStateModel = mongoose.model("JobState", jobStateSchema);
