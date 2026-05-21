import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import db from "@/lib/db";
import { NextResponse } from "next/server";

export async function DELETE(
  _req: Request,
  { params }: { params: { id: string } }
) {
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

  const currentSessionId = session.sessionId;

  if (userSession.id === currentSessionId) {
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
