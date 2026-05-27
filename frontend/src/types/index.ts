export type QuestionDifficulty = "Easy" | "Moderate" | "Challenging";

export interface QuestionTypeConfig {
  type: string;
  count: number;
  marks: number;
}

export interface Assignment {
  id: string;
  title: string;
  subject: string;
  grade: string;
  topic: string;
  dueDate: string;
  questionTypes: QuestionTypeConfig[];
  fileUrl?: string;
  instructions?: string;
  timeAllowed: string;
  schoolName?: string;
  createdAt: string;
  questionPaper?: QuestionPaper;
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

export interface QuestionPaper {
  id?: string;
  assignmentId: string;
  schoolName: string;
  subject: string;
  grade: string;
  timeAllowed: string;
  maxMarks: number;
  sections: PaperSection[];
  generatedAt: string;
}

export type JobStatus = "queued" | "processing" | "done" | "failed";

export interface JobState {
  jobId: string;
  assignmentId: string;
  status: JobStatus;
  stage: string;
  error?: string;
  questionPaper?: QuestionPaper;
}

export interface AssignmentCreateResponse {
  id: string;
  jobId: string;
}
