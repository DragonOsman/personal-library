"use client";

import { useState, useEffect } from "react";
import { authClient } from "@/auth-client";

export default function SessionsSection() {
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

  const handleRevokeAllSessions = async () => {
    try {
      await authClient.revokeSessions();

      await loadSessions();

      setStatus("All sessions have been logged out.");
    } catch (err) {
      setErrorMsg(`Failed to revoke sessions. ${err}`);
    }
  };

  const handleRevokeOtherSessions = async () => {
    try {
      await authClient.revokeOtherSessions();

      await loadSessions();

      setStatus("All other sessions have been logged out.");
    } catch (err) {
      setErrorMsg(`Failed to revoke other sessions. ${err}`);
    }
  };

  const hasSessions = sessions.length > 0;
  const hasOtherSessions = sessions.length > 1;

  return (
    <div>
      <p className="text-sm text-gray-500">
        View and manage your active sessions.
      </p>
      <p className="text-info-content">
        Number of active sessions: {sessions.length}
      </p>
      {sessions.length === 1 && (
        <>
          <p className="text-info">
            Session created: {data && data.session && data.session.createdAt.toLocaleDateString()}
          </p>
          <p className="text-info">
            Last activity: {data && data.session && data.session.updatedAt.toLocaleDateString()}
          </p>
          <p className="text-info">
            Browser: {(data && data.session && data.session.userAgent) ?? "Unknown user agent"}
          </p>
          <p className="text-info">
            IP address: {(data && data.session && data.session.ipAddress) ?? "Unknown IP address"}
          </p>
        </>
      )}
      <ul className="mt-4 space-y-2">
        {sessions.length > 1 && sessions.map((session: typeof sessions[0]) => {
          return (
            <li key={session.id} className="rounded border p-3">
              <p className="text-info">
                Session created: {session.createdAt.toLocaleDateString()}
              </p>
              <p className="text-info">
                Last session activity: {session.updatedAt.toLocaleDateString()}
              </p>
              <p className="text-info">
                Browser: {(session.userAgent) ?? "Unknown user agent"}
              </p>
              <p className="text-info">
                IP address: {(session.ipAddress) ?? "Unknown IP address"}
              </p>
            </li>
          );
        })}
      </ul>
      <button
        type="button"
        title="Log out of all sessions"
        className="btn btn-warning mt-2"
        disabled={!hasSessions}
        onClick={handleRevokeAllSessions}
      >
        Log out of All Devices
      </button>
      <button
        type="button"
        title="Log out of other sessions"
        className="btn btn-warning mt-2 ml-2"
        disabled={!hasOtherSessions}
        onClick={handleRevokeOtherSessions}
      >
        Log out of Other Devices
      </button>
      {errorMsg && <p className="text-error">{errorMsg}</p>}
      {status && <p className="text-info">{status}</p>}
    </div>
  );
}