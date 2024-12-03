"use client";

import { useSearchParams } from "next/navigation";
import { useFormState } from "react-dom";
import { resendVerificationEmail } from "@/app/actions/auth-actions";
import ResendButton from "./resend-button";

const Form = () => {
  const searchParams = useSearchParams();
  const email = searchParams.get("email");
  const verificationSent = Boolean(searchParams.get("verification_sent"));
  const [formState, action] = useFormState(resendVerificationEmail.bind(null, email!), undefined);

  return (
    <>
      {/* Displaying the formState message if available */}
      {!!formState && (
        <div className="mb-4">
          <p className="text-blue-500">{formState}</p>
        </div>
      )}

      {/* Displaying success message verification link has been sent */}
      {!!verificationSent && (
        <div className="mb-4">
          <p className="text-green-500">A verification link has been sent to your email</p>
        </div>
      )}

      <form action={action}>
        <ResendButton />
      </form>
    </>
  );
};

export default Form;