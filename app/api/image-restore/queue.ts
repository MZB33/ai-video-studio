import { Queue } from "bullmq";

export function getQueue() {
  const connection = process.env.REDIS_URL ? { url: process.env.REDIS_URL } : { host: "127.0.0.1", port: 6379 };
  return new Queue("image-restore", { connection });
}
