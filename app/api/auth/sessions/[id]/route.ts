import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import db from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const origin = request.headers.get("origin");
  const host = request.headers.get("host");
  if (origin && host) {
    try {
      const allowedOrigin = new URL(process.env.NEXTAUTH_URL ?? `http://${host}`).origin;
      if (origin !== allowedOrigin) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
      }
    } catch {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
  }

  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userSession = await db.userSession.findUnique({
    where: { id: params.id },
  });

  if (!userSession || userSession.userId !== session.user.id) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  if (userSession.id === session.sessionId) {
    return NextResponse.json(
      { error: "Cannot revoke current session" },
      { status: 400 }
    );
  }

  await db.userSession.update({
    where: { id: params.id },
    data: { isRevoked: true },
  });

  return NextResponse.json({ success: true });
}
