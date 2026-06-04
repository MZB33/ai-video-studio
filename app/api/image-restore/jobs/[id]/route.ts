import { NextResponse } from "next/server";
import { getQueue } from "../../queue";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const queue = getQueue();
    const job = await queue.getJob(id as string);
    if (!job) return NextResponse.json({ error: "Not found" }, { status: 404 });
    const state = await job.getState();
    const result = { id: job.id, state, progress: job.progress, failedReason: job.failedReason, returnvalue: job.returnvalue };
    return NextResponse.json(result);
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  // For BullMQ, processing is done by a worker process. POST here will just return current state.
  const { id } = await params;
  try {
    const queue = getQueue();
    const job = await queue.getJob(id as string);
    if (!job) return NextResponse.json({ error: "Not found" }, { status: 404 });
    const state = await job.getState();
    return NextResponse.json({ id: job.id, state, progress: job.progress, returnvalue: job.returnvalue });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
