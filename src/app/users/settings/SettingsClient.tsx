// Copyright (c) 2026 Your Name
// Licensed under the GPL v3

"use client";

import { useState, useEffect, useMemo } from "react";
import { authClient } from "@/auth-client";
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
import SettingsSidebar from "./SettingsSidebar";
import type { Section } from "./helpers";
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
  const [activeSection, setActiveSection] = useState("");
  const [activeSubsection, setActiveSubsection] = useState("");
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  let twoFactorEnabled:boolean = false;
  if (data && data.user && data.user.twoFactorEnabled !== undefined &&
      data && data.user && data.user.twoFactorEnabled !== null) {
    twoFactorEnabled = data.user.twoFactorEnabled;
  }

  const sections = useMemo<Section[]>(() => [
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
  ], [user, twoFactorEnabled]);

  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) {
          return;
        }

        const id = entry.target.id;
        const section = sections.find(section => section.id === id);

        if (section) {
          setActiveSection(section.id);
          if (section.subsections.length > 0) {
            setExpandedSection(section.id);
          }
          return;
        }

        for (const section of sections) {
          const subsection = section.subsections.find(subsection => subsection.id === id);

          if (subsection) {
            setActiveSection(section.id);
            setActiveSubsection(subsection.id);
            setExpandedSection(section.id);
            return;
          }
        }
      });
    },
    {
      rootMargin: "-25% 0px -50% 0px",
      threshold: 0
    });

    sections.forEach(section => {
      const element = document.getElementById(section.id);
      if (element) {
        observer.observe(element);
      }

      section.subsections.forEach(subsection => {
        const element = document.getElementById(subsection.id);
        if (element) {
          observer.observe(element);
        }
      });
    });

    return () => observer.disconnect();
  }, [sections]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="w-full border-b bg-white px-6 py-4 shadow-sm">
        <h1 className="text-3xl font-bold text-gray-900">
          User Settings
        </h1>
      </div>

      <div className="mx-auto flex max-w-7xl flex-col gap-6 p-6 lg:flex-row">
        <SettingsSidebar
          sections={sections}
          activeSection={activeSection}
          activeSubsection={activeSubsection}
          expandedSection={expandedSection}
          setExpandedSection={setExpandedSection}
         />
        <main className="flex-1 bg-white rounded-xl border shadow-sm p-6 scroll-mt-24">
          <Card>
            {sections.map(section => (
              <section
                id={section.id}
                key={section.id}
              >
                <h2>{section.title}</h2>

                {section.render()}

                {section.subsections.length > 0 && section.subsections.map(subsection => (
                    <section
                      key={subsection.id}
                      id={subsection.id}
                      className="mt-8 border-t pt-6 scroll-mt-24"
                    >
                      <h3>{subsection.title}</h3>
                      {subsection.render()}
                  </section>
                ))}
              </section>
            ))}
          </Card>
        </main>
      </div>
    </div>
  );
}