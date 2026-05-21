import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => {
        if (!token) return false;
        if (!token.emailVerified) return false;
        return true;
      },
    },
    pages: {
      signIn: "/login?error=unverified",
    },
  }
);

export const config = {
  matcher: ["/dashboard/:path*"],
};
