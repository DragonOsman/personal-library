// Copyright (c) 2026 Your Name
// Licensed under the GPL v3

"use client";

import { useState, useEffect, ReactNode } from "react";
import { authClient } from "@/auth-client";
import EmailSection from "./EmailsSection";
import ProfileSection from "./ProfileSection";
import AccountSection from "./AccountSection";
import AuthenticationSection from "./AuthenticationSection";
import DangerZoneSection from "./DangerSection";
import Card from "@/app/components/ui/Card";
import { Prisma } from "@/app/generated/prisma/client";

let sections: { id: string; title: string; render: () => ReactNode }[] = [];
let subSections: { id: string; title: string; parent: string }[] = [];

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
  const [status, setStatus] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

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

  const handleSectionChange = (section: sectionId) => {
    setActiveSection(section);
    setActiveSubSection(null);
  };

  sections = [
    { id: "profile", title: "Profile", render: () => <ProfileSection user={user} /> },
    { id: "account", title: "Account Information", render: () => <AccountSection /> },
    { id: "authentication", title: "Authentication", render: () => <AuthenticationSection /> },
    { id: "emails", title: "Emails", render: () => <EmailSection user={user} />},
    //{ id: "library", title: "Library", render: () => ()},
    //{ id: "notifications", title: "Notifications", render: () => ()},
    { id: "danger", title: "Danger Zone", render: () => <DangerZoneSection />}
  ];

  subSections = [
    { id: "changePassword", title: "Change Password", parent: "authentication" },
    { id: "twoFactorAuth", title: "Two-Factor Authentication", parent: "authentication" },
    { id: "sessions", title: "Sessions", parent: "authentication" },
    //{ id: "display", title: "Display", parent: "library" },
    //{ id: "defaults", title: "Defaults", parent: "library" },
    //{ id: "importExport", title: "Import/Export", parent: "library" },
    //{ id: "privacy", title: "Privacy", parent: "library" },
    //{ id: "readingReminders", title: "Reading Reminders", parent: "notifications" },
    { id: "oauth", title: "OAuth Accounts", parent: "authentication" }
  ];

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
          {sections.map(section => (
            <Card key={section.id}>
              <section
                id={section.id}
                className="scroll-mt-[5rem] space-y-6"
              >
                <h2 className={`${section.id === "danger" ?
                  "text-danger bg-slate-300" :
                  ""} text-2xl font-bold`}>
                  {section.title}
                </h2>
                {section.render()}
              </section>
            </Card>
          ))}
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