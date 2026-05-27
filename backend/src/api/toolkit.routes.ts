import { GoogleGenerativeAI } from "@google/generative-ai";
import { Router } from "express";
import { z } from "zod";
import { env } from "../config/env.js";
import { logger } from "../config/logger.js";

const toolkitSchema = z.object({
  tool: z.string().min(1).max(80),
  topic: z.string().min(1).max(160)
});

const responseSchema = z.object({
  lines: z.array(z.string().min(1)).min(3).max(8)
});

export const toolkitRouter = Router();

function isQuotaError(error: unknown) {
  const message = error instanceof Error ? error.message : String(error);
  return /429|quota|resource_exhausted|rate limit|exceeded/i.test(message);
}

function fallbackLines(tool: string, topic: string) {
  return [
    `${tool}: ${topic}`,
    `Objective: Check understanding of ${topic} with focused classroom tasks.`,
    "Structure: Start with recall, add one application task, and finish with review.",
    "Assessment: Keep marking points short, specific, and aligned to the topic."
  ];
}

toolkitRouter.post("/", async (req, res) => {
  const parsed = toolkitSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Please enter a valid tool and topic." });
    return;
  }

  const { tool, topic } = parsed.data;
  if (!env.GEMINI_API_KEY) {
    res.json({ lines: fallbackLines(tool, topic) });
    return;
  }

  try {
    const genAI = new GoogleGenerativeAI(env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: env.GEMINI_MODEL });
    const prompt = [
      "Create a concise teacher toolkit draft.",
      "Return only JSON: {\"lines\":[\"...\"]}.",
      `Tool: ${tool}`,
      `Topic: ${topic}`,
      "Rules: 4 to 6 lines, under 18 words per line, practical classroom language, no markdown."
    ].join("\n");

    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: {
        maxOutputTokens: 220,
        temperature: 0.4,
        responseMimeType: "application/json"
      }
    });
    const text = result.response.text();
    const output = responseSchema.parse(JSON.parse(text));
    res.json(output);
  } catch (error) {
    if (isQuotaError(error)) {
      res.status(429).json({ error: "Gemini API limit reached. Use a new API key or wait for the quota to renew." });
      return;
    }

    logger.warn("Toolkit generation failed", error);
    res.json({ lines: fallbackLines(tool, topic) });
  }
});
