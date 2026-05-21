declare module "lucide-react";

import "next-auth";
import "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      emailVerified?: Date | null;
    };
    sessionId?: string;
  }

  interface User {
    emailVerified?: Date | null;
    userAgent?: string;
    ipAddress?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    emailVerified?: Date | null;
    sessionId?: string;
  }
}
