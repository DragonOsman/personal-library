// Copyright (c) 2026 Your Name
// Licensed under the GPL v3

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/auth-client";
import { updateProfile } from "./helpers";
import { setPrimaryEmail, removeEmail } from "./actions";
import { Formik } from "formik";
import { toFormikValidationSchema } from "zod-formik-adapter";
import { profileSchema, changeEmailSchema } from "@/utils/validation";
import TwoFASection from "./TwoFASection";
import OAuthSection from "./OAuthSection";
import PasswordSection from "./PasswordSection";
import UserCard from "@/app/components/UserCard";
import Card from "@/app/components/ui/Card";
import { Prisma } from "@/app/generated/prisma/client";

const sections = [
  { id: "profile", title: "Profile" },
  { id: "account", title: "Account" },
  { id: "authentication", title: "Authentication" },
  { id: "emails", title: "Emails" },
  { id: "library", title: "Library" },
  { id: "notifications", title: "Notifications" },
  { id: "danger", title: "Danger Zone" }
];

const subSections = [
  { id: "changePassword", title: "Change Password", parent: "authentication" },
  { id: "twoFactorAuth", title: "Two-Factor Authentication", parent: "authentication" },
  { id: "sessions", title: "Sessions", parent: "authentication" },
  { id: "display", title: "Display", parent: "library" },
  { id: "defaults", title: "Defaults", parent: "library" },
  { id: "importExport", title: "Import/Export", parent: "library" },
  { id: "privacy", title: "Privacy", parent: "library" },
  { id: "readingReminders", title: "Reading Reminders", parent: "notifications" },
  { id: "oauth", title: "OAuth Accounts", parent: "authentication" }
];

type sectionId = (typeof sections)[number]["id"];
type subSectionId = (typeof subSections)[number]["id"];

type User = Prisma.UserGetPayload<{
  include: {
    emails: true;
    accounts: true;
    twofactors: true;
  };
}>;

interface SettingsClientProps {
  user: User;
}

export default function SettingsClient({ user }: SettingsClientProps) {
  const { data, error, isPending } = authClient.useSession();

  const [activeSection, setActiveSection] = useState<sectionId>(sections[0].id);
  const [activeSubSection, setActiveSubSection] = useState<subSectionId | null>(null);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [showProfileForm, setShowProfileForm] = useState(false);
  const [showEmailForm, setShowEmailForm] = useState(false);

  const router = useRouter();

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
      setLoading(true);
    } else {
      setLoading(false);
    }
  }, [isPending]);

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

  const handleSectionChange = (section: sectionId) => {
    setActiveSection(section);
    setActiveSubSection(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="w-full border-b bg-white px-6 py-4 shadow-sm">
        <h1 className="text-3xl font-bold text-gray-900">
          User Settings
        </h1>
      </div>

      <div className="mx-auto flex max-w-7xl flex-col gap-6 p-6 lg:flex-row">
        <aside className="w-full lg:w-64 shrink-0">
          <Card>
            <nav className="w-full space-y-4">
              <ul className="space-y-2">
                {sections.map(section => (
                  <li key={section.id}>
                    <button
                      type="button"
                      className={`cursor-pointer px-2 py-1 rounded ${
                        activeSection === section.id
                          ? "text-blue-600 font-semibold"
                          : "text-gray-700"
                      }`}
                      onClick={(event) => {
                        event.stopPropagation();
                        handleSectionChange(section.id);
                      }}
                      title="change section"
                    >
                      {section.title}
                    </button>
                    {activeSection === section.id && (
                      <ul className="ml-2 mt-1 space-y-1">
                        {subSections
                          .filter(subSection => subSection.parent === section.id)
                          .map(subSection => (
                            <li
                              key={subSection.id}
                              className={`cursor-pointer px-2 py-1 rounded ${
                                activeSubSection === subSection.id
                                  ? "text-blue-600 font-semibold"
                                  : "text-gray-700"
                                }`}
                              onClick={(event) => {
                                event.stopPropagation();
                                setActiveSubSection(subSection.id);
                              }}
                            >
                              {subSection.title}
                            </li>
                          ))}
                      </ul>
                    )}
                  </li>
                ))}
              </ul>
            </nav>
          </Card>
        </aside>

        <main className="flex-1 bg-white rounded-xl border shadow-sm p-6">
          <h1 className="text-2xl font-bold mb-4">
            {subSections.find(subSection => subSection.id === activeSubSection)?.title
              || sections.find(section => section.id === activeSection)?.title}
          </h1>

          {activeSection === "profile" && (
            <Card>
              {user && user.twoFactorEnabled && (
                <UserCard
                  user={user}
                  twoFactorEnabled={user.twoFactorEnabled}
                />
              )}

              {showProfileForm && (
                <Formik
                  initialValues={{ name: user?.name || "", bio: user?.bio || "" }}
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
                            <p className="text-error text-sm">{errors.name}</p>
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
                          title="change primary email address"
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
            </Card>
          )}

          {activeSection === "account" && (
            <Card>
              <dl className="space-y-4">
                <>
                  <dt className="text-sm text-gray-500">Name</dt>
                  <dd>{user.name}</dd>
                </>
                <>
                  <dt className="text-sm text-gray-500">Email</dt>
                  <dd>{user.email}</dd>
                </>
                <>
                  <dt className="text-sm text-gray-500">Bio</dt>
                  <dd>{user.bio || "No bio available."}</dd>
                </>
                <>
                  <dt className="text-sm text-gray-500">Joined</dt>
                  <dd>{user.createdAt && new Date(user.createdAt).toLocaleDateString()}</dd>
                </>
              </dl>
            </Card>
          )}

          {activeSection === "authentication" && (
            <Card>
              {activeSubSection === "changePassword" && (
                <PasswordSection id="changePassword" title="Change Password" />
              )}
              {activeSubSection === "twoFactorAuth" && (
                <TwoFASection
                  enabled={user?.twoFactorEnabled ?? false}
                  title="Two-Factor Authentication"
                  id="twoFactorAuth"
                />
              )}
              {activeSubSection === "oauth" && (
                <OAuthSection id="oauth" title="OAuth Accounts" />
              )}
              {activeSubSection === "sessions" && (
                <div>
                  <h2 className="text-lg font-semibold">Sessions</h2>
                  <p className="text-sm text-gray-500">
                    View and manage your active sessions.
                  </p>
                  <p>Last logged in: {data && data.session.createdAt.toLocaleString()}</p>
                  <p>Last activity: {data && data.session.updatedAt.toLocaleString()}</p>
                  <button
                    type="button"
                    title="Log out of all sessions"
                    className="btn btn-warning mt-2"
                    onClick={async () => {
                      await authClient.revokeSessions();
                      router.refresh();
                    }}
                  >
                    Log Out of All Sessions
                  </button>
                  <button
                    type="button"
                    title="Log out of other sessions"
                    className="btn btn-warning mt-2 ml-2"
                    onClick={async () => {
                      await authClient.revokeOtherSessions();
                      router.refresh();
                    }}
                  >
                    Log Out of Other Sessions
                  </button>
                </div>
              )}
            </Card>
          )}

          {activeSection === "emails" && (
            <Card>
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold">
                    Email Addresses
                  </h3>

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
                </div>
              </div>
            </Card>
          )}

          {activeSection === "danger" && (
            <Card>
              <button
                type="button"
                title="Delete account"
                className="btn btn-error"
                onClick={() => authClient.deleteUser()}
              >
                Delete Account
              </button>
            </Card>
          )}

          {status && (
            <p className="mt-4 text-green-600">
              {status}
            </p>
          )}

          {errorMsg && (
            <p className="mt-4 text-red-600">
              {errorMsg}
            </p>
          )}
        </main>
      </div>
    </div>
  );
}