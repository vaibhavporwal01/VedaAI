import { logger } from "./config/logger.js";
import { connectMongo } from "./infrastructure/db/connection.js";
import { assertRedisReady } from "./infrastructure/cache/redis.js";
import { startAssignmentWorker } from "./infrastructure/queue/worker.js";

async function bootstrap() {
  await connectMongo();
  await assertRedisReady();
  startAssignmentWorker();
}

bootstrap().catch((error) => {
  logger.error("Worker bootstrap failed", error);
  process.exit(1);
});
