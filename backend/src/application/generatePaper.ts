import { GoogleGenerativeAI } from "@google/generative-ai";
import { env } from "../config/env.js";
import { logger } from "../config/logger.js";
import { generatedQuestionPaperSchema } from "../domain/schemas.js";
import type { AssignmentEntity, PaperQuestion, PaperSection, QuestionPaperEntity } from "../domain/types.js";
import { buildQuestionPaperPrompt } from "./prompt.js";

function normalizePaper(assignment: AssignmentEntity, parsed: unknown): QuestionPaperEntity {
  const paper = generatedQuestionPaperSchema.parse(parsed);
  const maxMarks = paper.sections.reduce(
    (sum, section) => sum + section.questions.reduce((sectionSum, question) => sectionSum + question.marks, 0),
    0
  );
  return {
    assignmentId: assignment.id,
    schoolName: assignment.schoolName || env.DEFAULT_SCHOOL_NAME || paper.schoolName,
    subject: assignment.subject,
    grade: assignment.grade,
    timeAllowed: assignment.timeAllowed,
    maxMarks,
    sections: paper.sections,
    generatedAt: new Date()
  };
}

const difficulties = ["Easy", "Moderate", "Challenging"] as const;

function isDsaAssignment(assignment: AssignmentEntity) {
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
      answer: "Linear search checks each element one by one, while binary search repeatedly halves a sorted search space."
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

function genericQuestion(type: string, index: number, marks: number, assignment: AssignmentEntity): PaperQuestion {
  const topic = assignment.topic || assignment.subject || "the selected topic";
  const prompts = [
    `Define an important concept from ${topic} and explain why it matters.`,
    `Write two key points about ${topic} with a suitable example.`,
    `Compare two related ideas from ${topic} and mention one difference.`,
    `Apply ${topic} to a classroom-style problem and explain your reasoning.`,
    `Create a labeled diagram or flow for a process related to ${topic}.`
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

function fallbackPaper(assignment: AssignmentEntity): QuestionPaperEntity {
  const sections: PaperSection[] = assignment.questionTypes.map((type, sectionIndex) => ({
    title: makeSectionTitle(sectionIndex),
    heading: type.type,
    instruction: `Attempt all questions. Each question carries ${type.marks} mark${type.marks === 1 ? "" : "s"}`,
    questions: Array.from({ length: type.count }, (_, index) =>
      isDsaAssignment(assignment)
        ? dsaQuestion(type.type, index, type.marks)
        : genericQuestion(type.type, index, type.marks, assignment)
    )
  }));

  return {
    assignmentId: assignment.id,
    schoolName: assignment.schoolName || env.DEFAULT_SCHOOL_NAME,
    subject: assignment.subject,
    grade: assignment.grade,
    timeAllowed: assignment.timeAllowed,
    maxMarks: sections.reduce(
      (sum, section) => sum + section.questions.reduce((sectionSum, question) => sectionSum + question.marks, 0),
      0
    ),
    sections,
    generatedAt: new Date()
  };
}

export async function generateQuestionPaper(assignment: AssignmentEntity) {
  if (!env.GEMINI_API_KEY) {
    logger.warn("GEMINI_API_KEY missing; using deterministic local fallback paper");
    return fallbackPaper(assignment);
  }

  const genAI = new GoogleGenerativeAI(env.GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: env.GEMINI_MODEL });
  const prompt = buildQuestionPaperPrompt(assignment);
  let lastError: unknown;

  for (let attempt = 0; attempt < 2; attempt += 1) {
    try {
      const result = await model.generateContent({
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        generationConfig: {
          responseMimeType: "application/json"
        }
      });
      const text = result.response.text();
      if (!text.trim()) {
        throw new Error("Empty LLM response");
      }
      const parsed = JSON.parse(text);
      return normalizePaper(assignment, parsed);
    } catch (error) {
      lastError = error;
      logger.warn(`Gemini parse/generation attempt ${attempt + 1} failed`, error);
    }
  }

  throw lastError instanceof Error ? lastError : new Error("Question paper generation failed");
}
