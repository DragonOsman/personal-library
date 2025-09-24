"use client";

import { useState } from "react";

interface MfaSectionProps {
  enabled: boolean;
}

const MfaSection = ({ enabled }: MfaSectionProps) => {
  const [isEnabled, setIsEnabled] = useState(enabled);
  const [isLoading, setIsLoading] = useState(false);

  const toggleMfa = async () => {
    setIsLoading(true);

    const response = await fetch("/api/auth/toggle-mfa", {
      method: "POST",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify({ enable: !isEnabled })
    });

    if (response.ok) {
      setIsEnabled((prev => !prev));
    } else {
      const data = await response.json();
      alert(data.message ?? "An error occurred");
    }

    setIsLoading(false);
  };

  return (
    <section id="mfa" className="space-y-4">
      <h2 className="text-xl font-semibold">Multi-factor Authentication</h2>
      <p className="text-gray-700">
        MFA is currently <strong>{isEnabled ? "enabled" : "disabled"}</strong>.
      </p>
      <button
        type="button"
        title="toggle mfa"
        onClick={toggleMfa}
        disabled={isLoading}
        className={`px-4 py-2 rounded text-white ${
          isEnabled
          ? "bg-red-600 hover:bg-red-700"
          : "bg-blue-600 hover:bg-blue-700"
        } disabled:opacity-50`}
      >
        {isLoading
          ? "Updating..."
          : isEnabled
          ? "Disable MFA"
          : "Enable MFA"}
      </button>
    </section>
  );
};

export default MfaSection;
