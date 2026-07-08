// Copyright (c) 2026 Your Name
// Licensed under the GPL v3

"use client";

import { JSX } from "react";
import { authClient } from "@/auth-client";
import Link from "next/link";
import EmailSection from "./EmailsSection";
import ProfileSection from "./ProfileSection";
import AccountSection from "./AccountSection";
import DangerZoneSection from "./DangerSection";
import AuthenticationSection from "./AuthenticationSection";
import SessionsSection from "./SessionsSection";
import PasswordSection from "./PasswordSection";
import TwoFASection from "./TwoFASection";
import OAuthSection from "./OAuthSection";
import Card from "@/app/components/ui/Card";
import { Prisma } from "@/app/generated/prisma/client";

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
  const { data } = authClient.useSession();

  let twoFactorEnabled:boolean = false;
  if (data && data.user && data.user.twoFactorEnabled !== undefined &&
      data && data.user && data.user.twoFactorEnabled !== null) {
    twoFactorEnabled = data.user.twoFactorEnabled;
  }

  const sections: {
    id: string;
    title: string;
    render: () => JSX.Element;
      subsections: {
        id: string;
        title: string;
        render: () => JSX.Element;
      }[];
    }[] = [
    {
      id: "profile",
      title: "Profile",
      render: () => <ProfileSection user={user}/>,
      subsections: []
    },
    {
      id: "authentication",
      title: "Authentication",
      render: () => <AuthenticationSection />,
      subsections: [
        {
          id: "changePassword",
          title: "Change Password",
          render: () => <PasswordSection />
        },
        {
          id: "twoFactor",
          title: "Two-Factor Authentication",
          render: () => (
            <TwoFASection enabled={twoFactorEnabled}/>
          )
        },
        {
          id: "oauth",
          title: "OAuth Accounts",
          render: () => <OAuthSection />
        },
        {
          id: "sessions",
          title: "Sessions",
          render: () => <SessionsSection />
        }
      ]
    },
    {
      id: "account",
      title: "Account Section",
      render: () => <AccountSection user={user} />,
      subsections: []
    },
    {
      id: "emails",
      title: "Emails Section",
      render: () => <EmailSection user={user} />,
      subsections: []
    },
    {
      id: "danger",
      title: "Danger Zone",
      render: () => <DangerZoneSection />,
      subsections: []
    }
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
                    <Link href={`#${section.id}`}>
                      {section.title}
                    </Link>

                    {section.subsections.length > 0 && (
                      <ul>
                        {section.subsections.map(subsection => (
                          <li key={subsection.id}>
                            <Link href={`#${subsection.id}`}>
                              {subsection.title}
                            </Link>
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
              <section id={section.id}>
                <h2>{section.title}</h2>

                {section.render()}

                {section.subsections.length > 0 && section.subsections.map(subsection => (
                    <section
                      key={subsection.id}
                      id={subsection.id}
                      className="mt-8 border-t pt-6"
                    >
                      <h3>{subsection.title}</h3>
                      {subsection.render()}
                  </section>
                ))}
              </section>
            </Card>
          ))}
        </main>
      </div>
    </div>
  );
}