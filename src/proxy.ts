import { auth } from "./auth";
export { auth as proxy };

export const config = {
  matcher: ["/", "/users/profile", "/books/:path*"]
};
