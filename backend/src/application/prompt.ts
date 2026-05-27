import { env } from "../config/env.js";
import type { AssignmentEntity } from "../domain/types.js";

export function buildQuestionPaperPrompt(assignment: AssignmentEntity) {
  const questionTypes = assignment.questionTypes
    .map((item) => `- ${item.type}: ${item.count} questions, ${item.marks} marks each`)
    .join("\n");

  return [
    "Role: expert exam paper generator for Indian school curriculum.",
    "Create a school question paper and answer key from the exact teacher-provided inputs.",
    "",
    "Never include markdown. Return only strict JSON matching this schema:",
    "{",
    '  "schoolName": "string",',
    '  "subject": "string",',
    '  "grade": "string",',
    '  "timeAllowed": "string",',
    '  "maxMarks": 20,',
    '  "sections": [',
    "    {",
    '      "title": "Section A",',
    '      "heading": "Short Answer Questions",',
    '      "instruction": "Attempt all questions. Each question carries 2 marks",',
    '      "questions": [',
    '        { "text": "Question text", "difficulty": "Easy", "marks": 2, "answer": "Answer text" }',
    "      ]",
    "    }",
    "  ]",
    "}",
    "",
    `School: ${assignment.schoolName || env.DEFAULT_SCHOOL_NAME}`,
    `Subject: ${assignment.subject}`,
    `Grade/Class: ${assignment.grade}`,
    `Topic/source context: ${assignment.topic}`,
    `Time allowed: ${assignment.timeAllowed}`,
    "Question types:",
    questionTypes,
    `Additional instructions: ${assignment.instructions || "None"}`,
    "",
    "Rules:",
    "- The subject, grade, and topic above are authoritative. Do not replace them with another subject.",
    "- Every question must be about the provided topic/source context and additional instructions.",
    "- If the teacher asks for DSA, data structures, algorithms, programming, or computer science, generate only that content.",
    "- Do not generate EVS, electricity, electroplating, NCERT science, or any unrelated sample topic unless the teacher explicitly provided it.",
    "- Match the requested question type counts exactly.",
    "- Use difficulty labels only: Easy, Moderate, Challenging.",
    "- Sum maxMarks from the generated questions.",
    "- Include clear answer text for every question.",
    "- Do not expose the raw input payload.",
    "- Keep the output valid JSON that can be parsed with JSON.parse."
  ].join("\n");
}
