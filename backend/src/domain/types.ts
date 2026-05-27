export type QuestionDifficulty = "Easy" | "Moderate" | "Challenging";

export interface QuestionTypeConfig {
  type: string;
  count: number;
  marks: number;
}

export interface AssignmentEntity {
  id: string;
  title: string;
  subject: string;
  grade: string;
  topic: string;
  dueDate: Date;
  questionTypes: QuestionTypeConfig[];
  fileUrl?: string;
  instructions?: string;
  timeAllowed: string;
  schoolName?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface PaperQuestion {
  text: string;
  difficulty: QuestionDifficulty;
  marks: number;
  answer: string;
}

export interface PaperSection {
  title: string;
  heading: string;
  instruction: string;
  questions: PaperQuestion[];
}

export interface QuestionPaperEntity {
  id?: string;
  assignmentId: string;
  schoolName: string;
  subject: string;
  grade: string;
  timeAllowed: string;
  maxMarks: number;
  sections: PaperSection[];
  generatedAt: Date;
}

export type JobStatus = "queued" | "processing" | "done" | "failed";

export interface JobStateEntity {
  jobId: string;
  assignmentId: string;
  status: JobStatus;
  stage: string;
  error?: string;
  timestamps: {
    queuedAt?: Date;
    processingAt?: Date;
    doneAt?: Date;
    failedAt?: Date;
  };
}
