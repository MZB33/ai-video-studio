import { NextResponse, type NextRequest } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    // Query the main status API for task info
    const baseUrl = req.nextUrl.clone();
    baseUrl.pathname = "/api/status";
    
    const response = await fetch(baseUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "query", taskId: id }),
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: "Task not found" },
        { status: 404 }
      );
    }

    const task = await response.json();
    return NextResponse.json(task);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("DYNAMIC STATUS ERROR:", message);
    
    return NextResponse.json(
      { error: "Failed to fetch task status" },
      { status: 500 }
    );
  }
}
