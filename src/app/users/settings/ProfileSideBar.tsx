// Copyright (c) 2026 Osman Zakir
// Licensed under the GPL v3

"use client";

import clsx from "clsx";
import { useState, useEffect } from "react";

const navItems = [{
  id: "overview", label: "Overview"
}, {
  id: "authentication", label: "Authentication"
}, {
  id: "books", label: "Books"
}];

const ProfileSideBar = () => {
  const [active, setActive] = useState("overview");

  useEffect(() => {
    const handleScroll = () => {
      const sections = navItems
        .map(item => document.getElementById(item.id))
        .filter(Boolean) as HTMLElement[]
      ;

      const scrollY = window.scrollY + 120;
      for (const section of sections) {
        if (
          scrollY >= section.offsetTop &&
          scrollY < section.offsetTop + section.offsetHeight
        ) {
          setActive(section.id);
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <aside
      className="
        profile-sidebar
        w-full
        lg:w-56
        shrink-0
        border-b
        lg:border-b-0
        lg:border-r
        pb-4
        lg:pb-0
        lg:pr-4
      "
    >
      <nav
        className="
          profile-nav
          flex
          flex-row
          lg:flex-col
          gap-1
          overflow-x-auto
          lg:overflow-visible
          lg:sticky
          lg:top-24
        "
      >
        {navItems.map(item => (
          <a
            key={item.id}
            href={`#${item.id}`}
            className={clsx(
              "profile-navlink block rounded px-3 py-2 text-sm transition",
              active === item.id
              ? "bg-blue-100 text-blue-700 font-medium"
              : "text-gray-700 hover:bg-gray-100"
            )}
            title={`Navigate to ${item.label} section`}
          >{item.label}</a>
        ))}
      </nav>
    </aside>
  );
};

export default ProfileSideBar;