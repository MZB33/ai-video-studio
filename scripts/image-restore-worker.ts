import { Worker } from "bullmq";
import { processImage } from "../app/api/image-restore/processor";

const connection = process.env.REDIS_URL ? { connection: { url: process.env.REDIS_URL } } : { connection: { host: "127.0.0.1", port: 6379 } };

const worker = new Worker(
  "image-restore",
  async (job: any) => {
    const { image, mode } = job.data;
    const result = await processImage(image, mode);
    return result;
  },
  connection
);

worker.on("completed", (job: any, returnvalue: any) => {
  console.log(`Job ${job.id} completed`);
});

worker.on("failed", (job: any, err: Error) => {
  console.error(`Job ${job?.id} failed:`, err?.message || err);
});

console.log("Image restore worker started");
