import { useProfileStore } from "@/features/profile/store";
import { APP_PROFILE } from "@/lib/constants";
import type { Assignment, AssignmentCreateResponse, JobState, PaperQuestion, PaperSection, QuestionTypeConfig } from "@/types";

const STORAGE_KEY = "vedaai.local.assignments";
const difficulties = ["Easy", "Moderate", "Challenging"] as const;

function canUseStorage() {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

function readAssignments(): Assignment[] {
  if (!canUseStorage()) {
    return [];
  }

  try {
    return JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? "[]") as Assignment[];
  } catch {
    return [];
  }
}

function writeAssignments(assignments: Assignment[]) {
  if (canUseStorage()) {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(assignments));
  }
}

function valueFromForm(data: FormData, key: string, fallback = "") {
  const value = data.get(key);
  return typeof value === "string" && value.trim() ? value.trim() : fallback;
}

function currentSchoolName() {
  return useProfileStore.getState().schoolName || APP_PROFILE.schoolName;
}

function parseQuestionTypes(data: FormData): QuestionTypeConfig[] {
  const raw = data.get("questionTypes");
  if (typeof raw !== "string") {
    return [];
  }

  try {
    return JSON.parse(raw) as QuestionTypeConfig[];
  } catch {
    return [];
  }
}

function isDsaAssignment(assignment: Pick<Assignment, "subject" | "topic" | "instructions">) {
  const text = `${assignment.subject} ${assignment.topic} ${assignment.instructions ?? ""}`.toLowerCase();
  return /\b(dsa|data structure|algorithm|algorithms|linked list|stack|queue|tree|graph|sorting|searching)\b/.test(text);
}

function dsaQuestion(type: string, index: number, marks: number): PaperQuestion {
  const bank = [
    {
      text: "Which data structure follows LIFO order? (a) Queue (b) Stack (c) Array (d) Graph",
      answer: "Stack follows LIFO order because the last inserted element is removed first."
    },
    {
      text: "State the difference between linear search and binary search.",
      answer: "Linear search checks elements one by one, while binary search repeatedly halves a sorted search space."
    },
    {
      text: "Explain why the time complexity of binary search is O(log n).",
      answer: "Each comparison removes half of the remaining elements, so the number of steps grows logarithmically."
    },
    {
      text: "Write the main operations of a queue and mention one real-life use case.",
      answer: "The main queue operations are enqueue and dequeue. A printer queue is a common real-life use case."
    },
    {
      text: "Compare arrays and linked lists for insertion in the middle.",
      answer: "Arrays require shifting elements, while linked lists can insert by changing links after reaching the node."
    },
    {
      text: "Draw a binary tree with seven nodes and label its root, leaf nodes, and height.",
      answer: "A correct answer shows one root, six connected descendants, at least two leaves, and a valid height label."
    },
    {
      text: "Trace one pass of bubble sort for the list 5, 2, 8, 1.",
      answer: "After one pass, adjacent swaps move the largest value to the end, producing 2, 5, 1, 8."
    },
    {
      text: "Define recursion and explain the need for a base case.",
      answer: "Recursion is a function calling itself. A base case stops repeated calls and prevents infinite recursion."
    }
  ];
  const item = bank[index % bank.length];

  return {
    text: type.toLowerCase().includes("numerical")
      ? `${item.text} Include the final time or space complexity where applicable.`
      : item.text,
    difficulty: difficulties[index % difficulties.length],
    marks,
    answer: item.answer
  };
}

function genericQuestion(type: string, index: number, marks: number, assignment: Assignment): PaperQuestion {
  const topic = assignment.topic || assignment.subject || "the selected topic";
  const prompts = [
    `Define an important concept from ${topic} and explain why it matters.`,
    `Write two key points about ${topic} with a suitable example.`,
    `Compare two related ideas from ${topic} and mention one difference.`,
    `Apply ${topic} to a classroom-style problem and explain your reasoning.`,
    `Create a labeled diagram or flow for a process related to ${topic}.`,
    `Solve a short problem based on ${topic} and show the main steps.`
  ];

  let text = prompts[index % prompts.length];
  if (type.toLowerCase().includes("multiple")) {
    text = `Choose the correct option about ${topic} and justify it in one line.`;
  }
  if (type.toLowerCase().includes("long")) {
    text = `Explain ${topic} in detail with structure, examples, and conclusion.`;
  }

  return {
    text,
    difficulty: difficulties[index % difficulties.length],
    marks,
    answer: `The answer should stay focused on ${topic}, include the required facts, and match the assigned marks.`
  };
}

function makeSectionTitle(index: number) {
  return `Section ${String.fromCharCode(65 + index)}`;
}

export function generateLocalPaper(assignment: Assignment) {
  const sections: PaperSection[] = assignment.questionTypes.map((typeConfig, sectionIndex) => {
    const questions = Array.from({ length: typeConfig.count }, (_, questionIndex) =>
      isDsaAssignment(assignment)
        ? dsaQuestion(typeConfig.type, questionIndex, typeConfig.marks)
        : genericQuestion(typeConfig.type, questionIndex, typeConfig.marks, assignment)
    );

    return {
      title: makeSectionTitle(sectionIndex),
      heading: typeConfig.type,
      instruction: `Attempt all questions. Each question carries ${typeConfig.marks} mark${typeConfig.marks === 1 ? "" : "s"}`,
      questions
    };
  });

  return {
    assignmentId: assignment.id,
    schoolName: assignment.schoolName || currentSchoolName(),
    subject: assignment.subject,
    grade: assignment.grade,
    timeAllowed: assignment.timeAllowed,
    maxMarks: sections.reduce(
      (sum, section) => sum + section.questions.reduce((sectionSum, question) => sectionSum + question.marks, 0),
      0
    ),
    sections,
    generatedAt: new Date().toISOString()
  };
}

export const localAssignments = {
  list(): Assignment[] {
    return readAssignments().sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },

  get(id: string): Assignment | undefined {
    return readAssignments().find((assignment) => assignment.id === id);
  },

  create(data: FormData): AssignmentCreateResponse {
    const now = new Date().toISOString();
    const id = `local-${Date.now()}`;
    const assignment: Assignment = {
      id,
      title: valueFromForm(data, "title", "Untitled Assignment"),
      subject: valueFromForm(data, "subject", "General"),
      grade: valueFromForm(data, "grade", "Class"),
      topic: valueFromForm(data, "topic", "General topic"),
      dueDate: valueFromForm(data, "dueDate", now),
      questionTypes: parseQuestionTypes(data),
      fileUrl: data.get("file") instanceof File ? (data.get("file") as File).name : undefined,
      instructions: valueFromForm(data, "instructions"),
      timeAllowed: valueFromForm(data, "timeAllowed", "45 minutes"),
      schoolName: valueFromForm(data, "schoolName", currentSchoolName()),
      createdAt: now
    };
    assignment.questionPaper = generateLocalPaper(assignment);
    writeAssignments([assignment, ...readAssignments()]);
    return { id, jobId: id };
  },

  delete(id: string) {
    writeAssignments(readAssignments().filter((assignment) => assignment.id !== id));
  },

  regenerate(id: string): AssignmentCreateResponse {
    const assignments = readAssignments();
    const next = assignments.map((assignment) =>
      assignment.id === id ? { ...assignment, questionPaper: generateLocalPaper(assignment) } : assignment
    );
    writeAssignments(next);
    return { id, jobId: id };
  },

  status(id: string): JobState | undefined {
    const assignment = this.get(id);
    if (!assignment) {
      return undefined;
    }

    return {
      jobId: id,
      assignmentId: id,
      status: "done",
      stage: "Generated locally while the backend is unavailable",
      questionPaper: assignment.questionPaper ?? generateLocalPaper(assignment)
    };
  }
};
