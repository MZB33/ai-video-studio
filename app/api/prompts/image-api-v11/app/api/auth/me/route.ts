import { NextResponse } from "next/server";
import { resolveUserFromSessionCookie } from "@/lib/auth";

export async function GET(req: Request) {
  const authUser = resolveUserFromSessionCookie(req.headers.get("cookie"));
  if (!authUser) {
    return NextResponse.json({ error: "Unauthenticated" }, { status: 401 });
  }

  return NextResponse.json({
    user: {
      userId: authUser.userId,
      email: authUser.email,
      role: authUser.role,
    },
  });
}
