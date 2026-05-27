import http from "node:http";
import cors from "cors";
import express from "express";
import { env } from "./config/env.js";
import { logger } from "./config/logger.js";
import { assignmentsRouter } from "./api/assignments.routes.js";
import { healthRouter } from "./api/health.routes.js";
import { toolkitRouter } from "./api/toolkit.routes.js";
import { connectMongo } from "./infrastructure/db/connection.js";
import { createSocketServer } from "./infrastructure/websocket/server.js";

async function bootstrap() {
  await connectMongo();

  const app = express();
  app.use(
    cors({
      origin: env.FRONTEND_URL
    })
  );
  app.use(express.json());
  app.use(healthRouter);
  app.use("/api/assignments", assignmentsRouter);
  app.use("/api/toolkit", toolkitRouter);

  const server = http.createServer(app);
  createSocketServer(server);

  server.listen(env.PORT, () => {
    logger.info(`VedaAI backend listening on ${env.PORT}`);
  });
}

bootstrap().catch((error) => {
  logger.error("Backend bootstrap failed", error);
  process.exit(1);
});
