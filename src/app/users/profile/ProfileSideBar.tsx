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
    <aside className="w-56 shrink-0 border-r pr-4">
      <nav className="sticky top-24 space-y-1">
        {navItems.map(item => (
          <a
            key={item.id}
            href={`#${item.id}`}
            className={clsx(
              "block rounded p-3 py-2 text-sm-transition",
              active === item.id
              ? "bg-blue-100 text-blue-700 font-medium"
              : "text-gray-700 hover:bg-gray-100"
            )}
            title={`Navigate to ${item.label} section`}
          ></a>
        ))}
      </nav>
    </aside>
  );
};

export default ProfileSideBar;