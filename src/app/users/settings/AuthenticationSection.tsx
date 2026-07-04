"use client";

import PasswordSection from "./PasswordSection";
import OAuthSection from "./OAuthSection";
import TwoFactorSection from "./TwoFASection";
import { authClient } from "@/auth-client";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

export default function AuthenticationSection() {
  const router = useRouter();
  const { data, error, isPending } = authClient.useSession();
  const [status, setStatus] = useState("");
  const [sessions, setSessions] = useState<
    Awaited<ReturnType<typeof authClient.listSessions>>["data"]
  >([]);
  const [errorMsg, setErrorMsg] = useState("");

  const loadSessions = async () => {
    try {
      const { data, error } = await authClient.listSessions();

      if (error && error.message) {
        setErrorMsg(error.message);
        return;
      }

      setSessions(data ?? []);
    } catch (err) {
      setErrorMsg(String(err));
    }
  };

  useEffect(() => {
    loadSessions();
  }, []);

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

  const hasOtherSessions = sessions.length > 1;

  const handleRevokeAllSessions = async () => {
    try {
      await authClient.revokeSessions();

      await loadSessions();

      setStatus("All sessions have been logged out.");
    } catch (err) {
      setErrorMsg(`Failed to revoke sessions. ${err}`);
    }
  };

  return (
    <div className="space-y-4">
      <PasswordSection />
      <OAuthSection />
      <TwoFactorSection enabled={false} />
      <hr />
      <div>
        <h3 className="text-lg font-semibold">Sessions</h3>
        <p className="text-sm text-gray-500">
          View and manage your active sessions.
        </p>
        <p>Last logged in: {data && data.session.createdAt.toLocaleString()}</p>
        <p>Last activity: {data && data.session.updatedAt.toLocaleString()}</p>
        <button
          type="button"
          title="Log out of all sessions"
          className="btn btn-warning mt-2"
          disabled={!hasOtherSessions}
          onClick={async () => {
            await authClient.revokeSessions();
            router.refresh();
          }}
        >
          Log out of All Sessions
        </button>
        <button
          type="button"
          title="Log out of other sessions"
          className="btn btn-warning mt-2 ml-2"
          onClick={handleRevokeAllSessions}
        >
          Log out of Other Sessions
        </button>
        {errorMsg && <p className="text-error">{errorMsg}</p>}
        {status && <p className="text-info">{status}</p>}
      </div>
    </div>
  );
}