"use client";

import { findUserByEmail, verifyEmail } from "@/app/actions/auth-actions";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

const VerifyEmail = () => {
  const searchParams = useSearchParams();
  const email = searchParams.get("email");
  const token = searchParams.get("token");
  const [isLoading, setIsLoading] = useState(true);
  const [result, setResult] = useState("Error verifying your email");

  useEffect(() => {
    const emailVerification = async () => {
      try {
        if (!email || !token) {
          throw new Error("Missing required fields");
        }

        const user = await findUserByEmail(email);
        if (!user) {
          throw new Error("Invalid verification token");
        }

        if (token !== user.emailVerificationToken) {
          throw new Error("Invalid verification token");
        }

        await verifyEmail(user.email);
        setResult("Email verified successfully. Please relogin");
        setIsLoading(false);
      } catch (error) {
        console.log(`Error verifying email: ${error}`);
      }
    };

    emailVerification();
  }, [email, token]);

  return (
    <>
      <div className="mb-4">
        {isLoading ? "Please wait..." : result}
      </div>
      <div className="my-3">
        <Link href="/api/auth/login" className="bg-white py-3 px-2 rounded">
          Back to Login
        </Link>
      </div>
    </>
  );
};

export default VerifyEmail;