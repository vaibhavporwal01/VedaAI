import type { Server as HttpServer } from "node:http";
import { Server } from "socket.io";
import { env } from "../../config/env.js";
import { logger } from "../../config/logger.js";
import { getRedis } from "../cache/redis.js";
import { JOB_EVENTS_CHANNEL, type JobEvent } from "./events.js";

export function createSocketServer(httpServer: HttpServer) {
  const io = new Server(httpServer, {
    cors: {
      origin: env.FRONTEND_URL,
      methods: ["GET", "POST", "DELETE"]
    }
  });

  io.on("connection", (socket) => {
    logger.info(`Socket connected ${socket.id}`);
    socket.on("disconnect", () => logger.info(`Socket disconnected ${socket.id}`));
  });

  const subscriber = getRedis().duplicate();
  subscriber.subscribe(JOB_EVENTS_CHANNEL).catch((error: Error) => logger.error("Redis socket subscription failed", error));
  subscriber.on("message", (_channel: string, message: string) => {
    try {
      const event = JSON.parse(message) as JobEvent;
      io.emit(event.type, event.payload);
    } catch (error) {
      logger.error("Invalid websocket event payload", error);
    }
  });

  return io;
}
