import { z } from "zod";

export const questionTypeSchema = z.object({
  type: z.string().min(1),
  count: z.coerce.number().int().min(1).max(50),
  marks: z.coerce.number().int().min(1)
});

export const createAssignmentSchema = z.object({
  title: z.string().min(1),
  subject: z.string().min(1),
  grade: z.string().min(1),
  topic: z.string().min(1),
  dueDate: z
    .string()
    .min(1)
    .refine((value) => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const date = new Date(value);
      date.setHours(0, 0, 0, 0);
      return date >= today;
    }, "Due date cannot be in the past"),
  questionTypes: z.array(questionTypeSchema).min(1),
  instructions: z.string().max(1000).optional().default(""),
  timeAllowed: z.string().min(1).default("45 minutes"),
  schoolName: z.string().min(1).max(160).optional()
});

export const generatedQuestionPaperSchema = z.object({
  schoolName: z.string().min(1),
  subject: z.string().min(1),
  grade: z.string().min(1),
  timeAllowed: z.string().min(1),
  maxMarks: z.number().int().min(1),
  sections: z
    .array(
      z.object({
        title: z.string().min(1),
        heading: z.string().min(1),
        instruction: z.string().min(1),
        questions: z
          .array(
            z.object({
              text: z.string().min(1),
              difficulty: z.enum(["Easy", "Moderate", "Challenging"]),
              marks: z.number().int().min(1),
              answer: z.string().min(1)
            })
          )
          .min(1)
      })
    )
    .min(1)
});

export type CreateAssignmentInput = z.infer<typeof createAssignmentSchema>;
export type GeneratedQuestionPaperInput = z.infer<typeof generatedQuestionPaperSchema>;
