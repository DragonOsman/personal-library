import { auth } from "@/src/auth";
import prisma from "@/src/app/lib/db";
import { authenticator } from "otplib";

export async function POST(req: Request) {
  const session = await auth.api.getSession({
    headers: req.headers
  });
  if (!session?.user?.email) {
    return new Response("Unauthorized", { status: 401 });
  }
  const { token } = await req.json();
  const user = await prisma.user.findUnique({
    where: { email: session.user.email }
  });

  if (!user || !user.mfaSecret) {
    return new Response("MFA not set up", { status: 400 });
  }

  const isValid = authenticator.check(token, user.mfaSecret);
  if (!isValid) {
    return new Response("Invalid token", { status: 401 });
  }

  await prisma.user.update({
    where: { email: session.user.email },
    data: { mfaEnabled: true }
  });

  return new Response("MFA verified", { status: 200 });
}