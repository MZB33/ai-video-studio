import { NextResponse } from "next/server";

// Global task status storage
const taskStatus = new Map<string, {
  status: "pending" | "processing" | "completed" | "failed";
  progress: number;
  result?: unknown;
  error?: string;
  createdAt: number;
}>();

// Cleanup old tasks (older than 1 hour)
function cleanupOldTasks() {
  const now = Date.now();
  const maxAge = 60 * 60 * 1000; // 1 hour
  
  for (const [id, task] of taskStatus.entries()) {
    if (now - task.createdAt > maxAge) {
      taskStatus.delete(id);
    }
  }
}

export async function GET(req: Request) {
  cleanupOldTasks();
  
  // Return current service health status
  return NextResponse.json({
    status: "operational",
    timestamp: new Date().toISOString(),
    services: {
      api: "✓ online",
      ai_providers: "✓ configured",
      database: "✓ in-memory",
      cache: "✓ active"
    },
    uptime: process.uptime(),
    tasks_active: taskStatus.size,
  });
}

export async function POST(req: Request) {
  try {
    const { action, taskId } = await req.json();

    if (action === "register") {
      // Register a new task
      const id = taskId || `task_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      taskStatus.set(id, {
        status: "pending",
        progress: 0,
        createdAt: Date.now(),
      });
      return NextResponse.json({ id, status: "registered" });
    }

    if (action === "query" && taskId) {
      // Query task status
      const task = taskStatus.get(taskId);
      if (!task) {
        return NextResponse.json(
          { error: "Task not found" },
          { status: 404 }
        );
      }
      return NextResponse.json(task);
    }

    if (action === "update" && taskId) {
      // Update task status
      const task = taskStatus.get(taskId);
      if (!task) {
        return NextResponse.json(
          { error: "Task not found" },
          { status: 404 }
        );
      }
      
      const { status, progress, result, error } = await req.json();
      taskStatus.set(taskId, {
        ...task,
        status: status || task.status,
        progress: progress !== undefined ? progress : task.progress,
        result: result || task.result,
        error: error || task.error,
      });
      
      return NextResponse.json({ updated: true });
    }

    return NextResponse.json(
      { error: "Invalid action" },
      { status: 400 }
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("STATUS API ERROR:", message);
    return NextResponse.json(
      { error: "Failed to process status request" },
      { status: 500 }
    );
  }
}
