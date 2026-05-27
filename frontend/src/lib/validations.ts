import { z } from "zod";
import { isPastDate } from "./utils";

export const MAX_FILE_SIZE = 10 * 1024 * 1024;
export const ACCEPTED_FILE_TYPES = ["image/png", "image/jpeg", "application/pdf"];

export const questionTypeSchema = z.object({
  type: z.string().min(1, "Select a question type"),
  count: z.coerce
    .number({ invalid_type_error: "Enter a number" })
    .int("Use whole numbers only")
    .min(1, "Minimum 1 question")
    .max(50, "Maximum 50 questions"),
  marks: z.coerce
    .number({ invalid_type_error: "Enter marks" })
    .int("Use whole numbers only")
    .min(1, "Minimum 1 mark")
});

export const assignmentFormSchema = z.object({
  title: z.string().trim().min(2, "Assignment name is required").max(80, "Keep the title under 80 characters"),
  subject: z.string().trim().min(2, "Subject is required").max(60, "Keep the subject under 60 characters"),
  grade: z.string().trim().min(1, "Class or grade is required").max(40, "Keep the class under 40 characters"),
  topic: z.string().trim().min(2, "Topic is required").max(120, "Keep the topic under 120 characters"),
  timeAllowed: z.string().trim().min(2, "Time allowed is required").max(40, "Keep the duration under 40 characters"),
  dueDate: z
    .string()
    .min(1, "Due date is required")
    .refine((value) => !isPastDate(value), "Due date cannot be in the past"),
  instructions: z.string().max(1000, "Additional information must be 1000 characters or less").optional(),
  questionTypes: z.array(questionTypeSchema).min(1, "Add at least one question type"),
  file: z
    .custom<FileList>()
    .optional()
    .refine((files) => !files || files.length === 0 || files[0].size <= MAX_FILE_SIZE, "File must be 10MB or less")
    .refine(
      (files) => !files || files.length === 0 || ACCEPTED_FILE_TYPES.includes(files[0].type),
      "Only PNG, JPG, or PDF files are allowed"
    )
});

export type AssignmentFormValues = z.infer<typeof assignmentFormSchema>;
