import prisma from "@/app/lib/prisma";
import { Card, CardContent, CardHeader } from "@mui/material";
import { GrDocumentVerified, GrStatusWarning } from "react-icons/gr";
import { Link } from "@react-email/components";

interface VerifyEmailPageProps {
  searchParams: { [key: string]: string | string[] | undefined };
}

const Page = async ({ searchParams }: VerifyEmailPageProps) => {
  const verificationToken = searchParams.token;
  let message = "Verifying email...";
  let verified = false;
  if (verificationToken) {
    const user = await prisma.user.findUnique({
      where: {
        emailVerificationToken: verificationToken as string
      }
    });

    if (!user) {
      message = "User not found. Check your email verification link.";
    } else {
      await prisma.user.update({
        where: {
          emailVerificationToken: verificationToken as string
        },
        data: {
          emailVerified: new Date(),
          emailVerificationToken: undefined
        }
      });

      message = `Email verified! ${user.email}`;
      verified = true;
    }
  } else {
    message = "No verification token found. Check your email.";
  }

  return (
    <div className="grid place-content-center py-40">
      <Card className="max-w-sm text-center">
        <CardHeader>
          <h1 className="card-title">Email Verification</h1>
        </CardHeader>
        <CardContent>
          <div className="w-full grid place-content-center py-4">
            {verified ? <GrDocumentVerified fontSize={56} /> : <GrStatusWarning fontSize={56} /> }
          </div>
          <p className="text-lg text-muted-foreground">{message}</p>
        </CardContent>
        <div className="card-footer">
          <footer>
            {verified && (
              <Link href="/api/auth/register" className="bg-primary text-white text-sm font-medium hover:bg-primary/90 h-10 px-4 py-2 rounded-lg w-full text-center">
                Register
              </Link>
            )}
          </footer>
        </div>
      </Card>
    </div>
  );
};

export default Page;