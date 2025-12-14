"use client";
import { useState, useEffect } from "react";
import { useUser } from "../../context/UserContext";
import { updateAutoMerge, addAlternateEmail, unlinkProvider } from "./actions";

const sections = [
  { id: "profile", title: "Profile" },
  { id: "security", title: "Security" },
  { id: "emails", title: "Emails" },
  { id: "linkedAccounts", title: "Linked Accounts" }
];

export default function SettingsPanel() {
  const { user, setUser } = useUser();
  const [activeSection, setActiveSection] = useState(sections[0].id);
  const [autoMerge, setAutoMerge] = useState(user?.autoMergeAuth ?? false);
  const [loading, setLoading] = useState(false);
  const [newEmail, setNewEmail] = useState("");

  useEffect(() => {
    if (user?.autoMergeAuth !== undefined) {
      setAutoMerge(user.autoMergeAuth!);
    }
  }, [user]);

  const handleAutoMergeChange = async (flag: boolean) => {
    if (!user) {
      return;
    }
    setLoading(true);
    const res = await updateAutoMerge(flag);
    if (res.success) {
      setUser({ ...user, autoMergeAuth: flag });
      setAutoMerge(flag);
    }
    setLoading(false);
  };

  const handleAddEmail = async () => {
    if (!newEmail.trim() || !user) {
      return;
    }
    setLoading(true);
    const res = await addAlternateEmail(newEmail.trim());
    if (res.success) {
      setUser({ ...user, emails: [...user.emails, {email: newEmail.trim()}] });
      setNewEmail("");
    }
    setLoading(false);
  };

  const handleUnlinkProvider = async (provider: string) => {
    if (!user) {
      return;
    }
    setLoading(true);
    const res = await unlinkProvider(provider);
    if (res.success) {
      setUser({
        ...user,
        accounts: user.accounts?.filter(acc => acc.provider !== provider)
      });
    }
    setLoading(false);
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

        {activeSection === "security" && (
          <div className="flex gap-4 flex-col">
            <label htmlFor="merge-toggle" className="flex items-items gap-2">
              <input
                type="checkbox"
                name="merge-toggle"
                id="merge-toggle"
                title="Merge Toggle"
                onChange={event => handleAutoMergeChange(event.target.checked)}
                disabled={loading}
                checked={autoMerge}
              />
            </label>
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
                onClick={handleAddEmail}
                disabled={loading || !newEmail.trim()}
              >
                Add
              </button>
            </div>
            <ul className="mt-2 space-y-1">
              {user?.emails?.map(record => (
                <li key={record.email}>{record.email}</li>
              ))}
            </ul>
          </div>
        )}

        {activeSection === "linkedAccounts" && (
          <div className="flex flex-col gap-4">
            {user?.accounts?.map(acc => (
              <div key={acc.provider} className="flex items-center justify-between">
                <span>{acc.provider}</span>
                <button
                  type="button"
                  className="px-2 py-1 bg-red-500 text-white rounded disabled-opacity-50"
                  title="Unlink Provider"
                  onClick={() => handleUnlinkProvider(acc.provider)}
                  disabled={loading}
                >
                  Unlink
                </button>
              </div>
            ))}
            {!user?.accounts?.length && <p>No linked accounts.</p>}
          </div>
        )}
      </div>
    </div>
  );
}