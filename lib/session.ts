import db from "@/lib/db";

export async function createSession(userId: string, userAgent: string, ipAddress: string) {
  const session = await db.userSession.create({
    data: { userId, userAgent, ipAddress },
  });
  return session.id;
}

export async function validateSession(sessionId: string) {
  const session = await db.userSession.findUnique({
    where: { id: sessionId },
  });
  return session && !session.isRevoked;
}

export async function touchSession(sessionId: string) {
  try {
    await db.userSession.update({
      where: { id: sessionId },
      data: { lastActiveAt: new Date() },
    });
  } catch {
    // Silently skip — session touch is best-effort
  }
}
