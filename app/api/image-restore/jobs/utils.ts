import { promises as fs } from "fs";
import path from "path";

const JOB_DIR = path.join(process.cwd(), ".jobs", "image-restore");

export async function ensureJobDir() {
  try {
    await fs.mkdir(JOB_DIR, { recursive: true });
  } catch (e) {
    // ignore
  }
}

export function jobFilePath(id: string) {
  return path.join(JOB_DIR, `${id}.json`);
}

export async function writeJob(id: string, payload: unknown) {
  await ensureJobDir();
  await fs.writeFile(jobFilePath(id), JSON.stringify(payload, null, 2), "utf-8");
}

export async function readJob<T = unknown>(id: string): Promise<T | null> {
  try {
    const txt = await fs.readFile(jobFilePath(id), "utf-8");
    return JSON.parse(txt) as T;
  } catch (e) {
    return null;
  }
}

export async function listJobs() {
  await ensureJobDir();
  const files = await fs.readdir(JOB_DIR);
  return files.filter((f) => f.endsWith('.json')).map((f) => f.replace(/\.json$/, ''));
}
