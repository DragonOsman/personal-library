"use client";

import Link from "next/link";
import Card from "@/app/components/ui/Card";
import React from "react";
import { FaChevronDown, FaChevronRight } from "react-icons/fa";
import { Section } from "./helpers";

interface SettingsSidebarProps {
  sections: Section[];
  activeSection: string;
  activeSubsection: string;
  expandedSection: string | null;
  setExpandedSection: React.Dispatch<
    React.SetStateAction<string | null>
  >;
}

export default function SettingsSidebar({
  sections,
  activeSection,
  activeSubsection,
  expandedSection,
  setExpandedSection
}: SettingsSidebarProps) {
  return (
    <aside className="w-full shrink-0 lg:w-64">
      <Card>
        <nav>
          <ul className="space-y-2">
            {sections.map(section => (
              <li key={section.id}>
                <Link
                  href={`#${section.id}`}
                  className={`flex items-center justify-between rounded-lg px-4 py-3 transition-colors ${
                    activeSection === section.id
                      ? "bg-blue-600 text-white"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                  onClick={() => {
                    if (section.subsections.length > 0) {
                      setExpandedSection(current =>
                        current === section.id ? null : section.id
                      );
                    }
                  }}
                >
                  <span>{section.title}</span>

                  {section.subsections.length > 0 &&
                    (expandedSection === section.id
                      ? <FaChevronDown size={14}/>
                      : <FaChevronRight size={14}/>)}
                </Link>

                <div
                  className={`overflow-hidden transition-all duration-300 ${
                    expandedSection === section.id
                      ? "max-h-96 opacity-100"
                      : "max-h-0 opacity-0"
                  }`}
                >
                  <ul className="ml-4 mt-2 space-y-1">
                    {section.subsections.map(subsection => (
                      <li key={subsection.id}>
                        <Link
                          href={`#${subsection.id}`}
                          className={`block rounded-md px-5 py-2 text-sm transition-colors ${
                            activeSubsection === subsection.id
                              ? "bg-blue-100 font-medium text-blue-700"
                              : "text-gray-600 hover:bg-gray-100"
                          }`}
                        >
                          {subsection.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </li>
            ))}
          </ul>
        </nav>
      </Card>
    </aside>
  );
}