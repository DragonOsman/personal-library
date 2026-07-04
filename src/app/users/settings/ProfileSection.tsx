"use client";

import { useState, useEffect } from "react";
import { authClient } from "@/auth-client";
import { updateProfile } from "./helpers";
import { Formik } from "formik";
import { toFormikValidationSchema } from "zod-formik-adapter";
import { profileSchema } from "@/utils/validation";
import UserCard from "@/app/components/UserCard";
import { Prisma } from "@/app/generated/prisma/client";

type User = Prisma.UserGetPayload<{
  include: {
    emails: true;
    accounts: true;
    twofactors: true;
  };
}>;

export default function ProfileSection({ user }: { user: User }) {
  const { data, error, isPending } = authClient.useSession();
  const [status, setStatus] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [showProfileForm, setShowProfileForm] = useState(false);

  useEffect(() => {
    if (!error) {
      setErrorMsg("");
      return;
    }

    const { message, status, statusText } = error;

    setErrorMsg(
      status > 0
        ? `Error: ${status} ${statusText || message}`
        : message || "Session error"
    );
  }, [error]);

  useEffect(() => {
    if (!data?.user) {
      setStatus("Loading...");
    }
  }, [data]);

  useEffect(() => {
    if (isPending) {
      setStatus("Loading session...");
    }
  }, [isPending]);

  return (
    <>
      {user && user.twoFactorEnabled && (
        <UserCard
          user={user}
          twoFactorEnabled={user.twoFactorEnabled}
        />
      )}
      {showProfileForm && (
        <Formik
          initialValues={{
            name: user.name || "",
            bio: user.bio || ""
          }}
          validationSchema={toFormikValidationSchema(profileSchema)}
          onSubmit={async (values, { setSubmitting }) => {
            setSubmitting(true);
            try {
              await updateProfile({
                name: values.name,
                bio: values.bio
              });
              setStatus("Profile updated successfully.");
            } catch (error) {
              console.error("Failed to update profile:", error);
            } finally {
              setSubmitting(false);
            }
          }}
        >
          {({ touched, errors, getFieldProps, isSubmitting, handleSubmit }) => (
            <>
              <form
                className="space-y-4"
                onSubmit={(event) => {
                  event.preventDefault();
                  handleSubmit();
                }}
              >
                <fieldset className="form-control w-full">
                  <label className="label justify-start" htmlFor="name">
                    <span className="label-text">Full Name:</span>
                  </label>
                  <input
                    id="name"
                    type="text"
                    {...getFieldProps("name")}
                    className="input input-bordered w-full"
                  />
                  {touched.name && errors.name && (
                    <p className="text-error text-sm">{errors.name as unknown as string}</p>
                  )}
                </fieldset>
                <fieldset>
                  <label className="label justify-start" htmlFor="bio">
                    <span className="label-text">Bio:</span>
                  </label>
                  <textarea
                    {...getFieldProps("bio")}
                    rows={5}
                    className="textarea textarea-bordered w-full"
                  />
                  {touched.bio && errors.bio && (
                    <p className="text-error text-sm">{errors.bio}</p>
                  )}
                </fieldset>
                <input
                  type="submit"
                  value={isSubmitting ? "Saving profile..." : "Save profile"}
                  className="btn btn-primary w-full"
                  disabled={isSubmitting || Object.keys(errors).length > 0}
                  title="Update Profile"
                />
              </form>
            </>
          )}
        </Formik>
      )}
      <button
        type="button"
        title="Edit profile"
        className="btn btn-info w-full"
        onClick={() => setShowProfileForm(prev => !prev)}
      >
        {showProfileForm ? "Cancel" : "Edit Profile"}
      </button>
      {status && <p className="text-info">{status}</p>}
      {errorMsg && <p className="text-error">{errorMsg}</p>}
    </>
  );
}