import { auth } from "./auth";
import { NextRequest, NextResponse } from "next/server";

export const middleware = async (request: NextRequest) => {
  const session = await auth.api.getSession({
    headers: request.headers
  });

  if (!session) {
    return NextResponse.redirect(new URL("/auth/signin", request.url));
  }
  return NextResponse.next();
};

export const config = {
  matcher: ["/", "/users/profile", "/books/:path*"]
};