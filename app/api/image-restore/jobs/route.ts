import { NextResponse } from "next/server";
import { getQueue } from "../queue";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { image, mode } = body || {};
    if (!image) return NextResponse.json({ error: "No image provided" }, { status: 400 });

    const queue = getQueue();
    const job = await queue.add("restore", { image, mode });

    return NextResponse.json({ id: job.id, status: job.returnvalue ? "succeeded" : "queued", url: `/api/image-restore/jobs/${job.id}` }, { status: 202 });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
