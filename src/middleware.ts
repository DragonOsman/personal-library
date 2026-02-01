export { proxy as middleware } from "@/src/proxy";

export const config = {
  runtime: "nodejs",
  matcher: ["/", "/users/profile", "/books/:path*"]
};
