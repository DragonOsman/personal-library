import { auth } from "@/src/auth";
import prisma from "@/src/app/lib/db";
import { authenticator } from "otplib";
import QRCode from "qrcode";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.email) {
    return new Response("Unauthorized", { status: 401 });
  }
  const userEmail = session.user.email;

  const secret = authenticator.generateSecret(32);

  await prisma.user.update({
    where: { email: userEmail },
    data: { mfaSecret: secret }
  });

  const otpAuthURL = authenticator.keyuri(userEmail, "DragonOsman Personal Library", secret);
  const qrDataURL = await QRCode.toDataURL(otpAuthURL);

  return new Response(JSON.stringify({ qr: qrDataURL }), {
    status: 200,
    headers: { "Content-Type": "application/json" }
  });
}