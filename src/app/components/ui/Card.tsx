import React from "react";

export default function Card({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-full max-w-md bg-white/90 backdrop-blur-md shadow-xl rounded-2xl p-8">
      {children}
    </div>
  );
}