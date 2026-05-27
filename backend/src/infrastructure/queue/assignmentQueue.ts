import { Queue } from "bullmq";
import { getBullConnectionOptions } from "../cache/redis.js";

export const assignmentQueueName = "assignment-generation";

export function getAssignmentQueue() {
  return new Queue(assignmentQueueName, {
    connection: getBullConnectionOptions()
  });
}
