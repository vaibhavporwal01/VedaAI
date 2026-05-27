import dotenv from "dotenv";
import { z } from "zod";

dotenv.config({ path: "../.env" });
dotenv.config();

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  PORT: z.coerce.number().default(4000),
  FRONTEND_URL: z.string().url().default("http://localhost:3000"),
  MONGODB_URI: z.string().min(1).default("mongodb://localhost:27017/vedaai"),
  REDIS_URL: z.string().min(1).default("redis://localhost:6379"),
  GEMINI_API_KEY: z.string().optional(),
  GEMINI_MODEL: z.string().min(1).default("gemini-2.5-flash"),
  DEFAULT_SCHOOL_NAME: z.string().default("Delhi Public School, Sector-4, Bokaro"),
  DEFAULT_TEACHER_NAME: z.string().default("Vaibhav Porwal")
});

export const env = envSchema.parse(process.env);
