"use client";

import { useRouter } from "next/navigation";
import { authClient } from "@/auth-client";
import { setPrimaryEmail, removeEmail } from "./actions";
import { Formik } from "formik";
import { toFormikValidationSchema } from "zod-formik-adapter";
import { changeEmailSchema } from "@/utils/validation";
import { useState } from "react";

import { Prisma } from "@/app/generated/prisma/client";

type User = Prisma.UserGetPayload<{
  include: {
    emails: true;
    accounts: true;
    twofactors: true;
  };
}>;

interface EmailSectionProps {
  user: User;
}

export default function EmailSection({ user }: EmailSectionProps) {
  const router = useRouter();

  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleChangeEmail = async (email: string) => {
    if (!email.trim() || !user) {
      return;
    }
    setLoading(true);
    try {
      await authClient.changeEmail({
        newEmail: email.trim()
      });
      setStatus("New email added successfully.");
    } catch (err) {
      setErrorMsg(`Failed to add new email: ${err}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
         <p className="text-sm text-gray-500">
          Manage your email addresses.
        </p>
      </div>

        {user.emails.map(email => (
          <div
            key={email.id}
            className="flex items-center justify-between border rounded p-3"
          >
            <div className="flex flex-col">
              <p>{email.email}</p>
              <div className="flex gap-2 mt-1">
                {email.primary && (
                  <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded">
                    Primary
                  </span>
                )}

                {email.verified ? (
                  <span className="text-xs rounded bg-green-100 px-2 py-1">
                    Verified
                  </span>
                ) : (
                  <span className="text-xs rounded bg-yellow-100 px-2 py-1">
                    Not verified
                  </span>
                )}
              </div>
            </div>

            <div className="flex gap-2 mt-1">
              {!email.primary && (
                <button
                  type="button"
                  onClick={async () => {
                    await setPrimaryEmail(email.id);
                    setStatus("Primary email updated.");
                    router.refresh();
                  }}
                >
                  {loading ? "Setting..." : "Set as Primary"}
                </button>
              )}

              {!email.verified && (
                <button
                  type="button"
                  onClick={async () => {
                    await authClient.sendVerificationEmail({
                      email: email.email
                      });
                    setStatus("Verification email sent.");
                    router.refresh();
                  }}
                >
                  {loading ? "Sending..." : "Send Verification Email"}
                </button>
              )}

              <button
                type="button"
                title="Remove email address"
                onClick={async () => {
                  await removeEmail(email.id);
                  router.refresh();
                }}
              >
                {loading ? "Removing..." : "Remove Email Address"}
              </button>
            </div>
          </div>
          ))}
        <hr />
        <div className="space-y-3">
          {showEmailForm && (
            <Formik
              initialValues={{ email: "" }}
              validationSchema={toFormikValidationSchema(changeEmailSchema)}
              onSubmit={async (values, { setSubmitting }) => {
                setSubmitting(true);
                try {
                  await handleChangeEmail(values.email);
                  setStatus("New email added successfully.");
                  router.refresh();
                } catch (error) {
                    console.error("Failed to add email:", error);
                  setErrorMsg("Failed to add email.");
                 } finally {
                  setSubmitting(false);
                  }
              }}
            >
              {({ isSubmitting, errors, touched, getFieldProps, handleSubmit }) => (
                <div>
                  <form
                    className="space-y-4"
                    onSubmit={(event) => {
                      event.preventDefault();
                      handleSubmit();
                    }}
                  >
                    <fieldset>
                      <label className="label justify-start" htmlFor="email">
                        <span className="label-text">Email:</span>
                      </label>
                      <input
                        id="email"
                        type="email"
                        {...getFieldProps("email")}
                        className="input input-bordered w-full"
                      />
                      {touched.email && errors.email && (
                        <p className="text-error text-sm">{errors.email}</p>
                      )}
                    </fieldset>
                    <input
                      type="submit"
                      value={isSubmitting ? "Changing email..." : "Change email"}
                      className="btn btn-primary w-full"
                      disabled={isSubmitting || Object.keys(errors).length > 0}
                      title="Change primary email address"
                    />
                  </form>
                </div>
              )}
            </Formik>
          )}
          <button
            type="button"
            title="Add new email address"
            className="btn btn-info w-full"
            onClick={() => setShowEmailForm(prev => !prev)}
          >
            {showEmailForm ? "Cancel" : "Add New Email"}
          </button>
          {status && <p className="text-info">{status}</p>}
          {errorMsg && <p className="text-danger">{errorMsg}</p>}
      </div>
    </div>
  );
}