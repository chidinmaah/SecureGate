import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import db from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const sessions = await db.userSession.findMany({
    where: { userId: session.user.id },
    orderBy: { lastActiveAt: "desc" },
    select: {
      id: true,
      userAgent: true,
      ipAddress: true,
      isRevoked: true,
      lastActiveAt: true,
      createdAt: true,
    },
  });

  const currentSessionId = session.sessionId ?? null;

  return NextResponse.json({ sessions, currentSessionId });
}
