"use client";
import { useState, useEffect } from "react";
import { authClient } from "@/src/auth-client";
import { updateProfile, linkedAccounts, unlinkAccount } from "./helpers";

const sections = [
  { id: "profile", title: "Profile" },
  { id: "authentication", title: "Authentication" },
  { id: "emails", title: "Emails" },
  { id: "linkedAccounts", title: "Linked Accounts" },
  { id: "danger", title: "Danger Zone" }
];

type sectionId = (typeof sections)[number]["id"];

interface Account {
  id: string;
  providerId: string;
  createdAt: Date;
  updatedAt: Date;
  accountId: string;
  userId: string;
  scopes: string[];
}

export default function SettingsPanel() {
  const { data, error, isPending } = authClient.useSession();
  const [activeSection, setActiveSection] = useState<sectionId>(sections[0].id);
  const [loading, setLoading] = useState(false);
  const [newEmail, setNewEmail] = useState("");
  const [name, setName] = useState("");
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [status, setStatus] = useState<string>("");
  const [errorMsg, setErrorMsg] = useState<string>("");

  if (error) {
    const { message, status, statusText } = error;
    if ((message && message !== "") && status > 0 && statusText !== "") {
      return <p>{`Error: ${message} (${status}: ${statusText})`}</p>;
    }
  }

  const user = data?.user;
  useEffect(() => {
    if (!data || !data.user) {
      setStatus("Loading...");
    }
  }, [data]);

  const fullUser = user as typeof user & { alternateEmails ? : string[] };

  useEffect(() => {
    if (!user) {
      setErrorMsg("Not authenticated.");
    }
    setName(user?.name ?? "");
  }, [user]);

  useEffect(() => {
    if (isPending) {
      setStatus("Loading session...");
      setLoading(true);
    } else {
      setLoading(false);
    }
  }, [isPending]);

  useEffect(() => {
    if (error) {
      setErrorMsg(`Error: ${error.message || "Session error"}`);
    }
  }, [error]);

  useEffect(() => {
    const fetchLinkedAccounts = async () => {
      if (!user) {
        return;
      }

      try {
        const accountsData = await linkedAccounts();
        setAccounts(accountsData);
      } catch (err) {
        console.error(`Failed to fetch linked accounts: ${err}`);
      }
    };

    fetchLinkedAccounts();
  }, [user]);

  const handleProfileSave = async () => {
    setLoading(true);
    try {
      await updateProfile({ name });
      setStatus("Profile updated successfully.");
    } catch (err) {
      setErrorMsg(`Failed to update profile: ${err}`);
    } finally {
      setLoading(false);
    }
  };

  const handleChangeEmail = async () => {
    if (!newEmail.trim() || !user) {
      return;
    }
    setLoading(true);
    try {
      await authClient.changeEmail({ newEmail: newEmail.trim() });
      setStatus("Alternate email added successfully.");
      setNewEmail("");
    } catch (err) {
      setErrorMsg(`Failed to add alternate email: ${err}`);
    }
    setLoading(false);
  };

  const handleUnlinkAccount = async (providerId: string, accountId: string) => {
    if (!user) {
      return;
    }
    setLoading(true);
    try {
      const result = await unlinkAccount(providerId, accountId);
      if (result && result.status) {
        setStatus(`Unlinked account from ${providerId} successfully.`);
        setAccounts(prev => prev.filter(acc => acc.id !== accountId));
      }
    } catch (err) {
      setErrorMsg(`Failed to unlink account from ${providerId}: ${err}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <nav className="w-64 bg-white border-4 p">
        <ul className="space-y-2">
          {sections.map(sec => (
            <li
              className={`cursor-pointer px-2 py-1 rounded ${
                activeSection === sec.id ? "text-blue-600 font-semibold" : "text-gray-700"
              }`}
              key={sec.id}
              onClick={() => setActiveSection(sec.id)}
            >
              {sec.title}
            </li>
          ))}
        </ul>
      </nav>

      <div className="flex-1 p-6">
        <h1 className="text-2xl font-bold mb-4">
          {sections.find(sec => sec.id === activeSection)?.title}
        </h1>

        {activeSection === "profile" && (
          <div className="flex gap-4 flex-col">
            <p>Name: {user?.name}</p>
            <p>Email: {user?.email}</p>
          </div>
        )}

        {activeSection === "authentication" && (
          <div className="flex flex-col gap-4">
            <div>
              <label htmlFor="name" className="block mb-1 font-medium">
                Name
              </label>
              <input
                type="text"
                id="name"
                className="border p-2 w-64 rounded"
                value={name}
                onChange={e => setName(e.target.value)}
              />
            </div>
            <button
              type="button"
              className="btn btn-success px-4 py-2 bg-blue-500 text-white rounded disabled-opacity-50"
              title="Save Profile"
              onClick={handleProfileSave}
              disabled={loading}
            >
              Save Profile
            </button>
          </div>
        )}

        {activeSection === "emails" && (
          <div className="flex flex-col gap-4">
            <div>
              <input
                type="email"
                name="altEmail"
                id="altEmail"
                className="altEmail border p-2 2-64 rounded"
                title="Alternate Email"
                placeholder="Add alternate email"
                value={newEmail}
                onChange={event => setNewEmail(event.target.value)}
              />
              <button
                type="button"
                className="ml-2 px-4 py-2 bg-blue-500 text-white rounded disabled-opacity-50"
                title="Add Email"
                onClick={() => handleChangeEmail()}
                disabled={loading || !newEmail.trim()}
              >
                Change
              </button>
            </div>
            <ul className="mt-2 space-y-1">
              {fullUser.alternateEmails?.map(email => (
                <li key={email}>{email}</li>
              ))}
            </ul>
          </div>
        )}

        {activeSection === "linkedAccounts" && (
          <div className="flex flex-col gap-4">
            {accounts.map(acc => (
              <div key={acc.providerId} className="flex items-center justify-between">
                <span>{acc.providerId}</span>
                <button
                  type="button"
                  className="px-2 py-1 bg-red-500 text-white rounded disabled-opacity-50"
                  title="Unlink Provider"
                  onClick={() => handleUnlinkAccount(acc.providerId, acc.id)}
                  disabled={loading}
                >
                  Unlink
                </button>
              </div>
            ))}
            {!accounts.length && <p>No linked accounts.</p>}
          </div>
        )}
        {activeSection === "danger" && (
          <div className="flex flex-col-gap-4">
            <button
              type="button"
              className="btn btn-error"
              title="delete account"
              onClick={() => authClient.deleteUser()}
            >
              Delete Account
            </button>
          </div>
        )}
        {status && <p className="mt-4 text-green-600">{status}</p>}
        {errorMsg && <p className="mt-4 text-red-600">{errorMsg}</p>}
      </div>
    </div>
  );
}