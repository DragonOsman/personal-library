"use client";
import { authClient } from "@/src/auth-client";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";

interface Account {
  id: string;
  providerId: string;
  createdAt: Date;
  updatedAt: Date;
  accountId: string;
  userId: string;
  scopes: string[];
}

const OAuthSection = async () => {
  const [error, setError] = useState("");
  const { data: session } = authClient.useSession();
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [successMessage, setSuccessMessage] = useState("");
  const router = useRouter();
  if (!session || !session.session || !session.user) {
    alert("Please sign in first");
    router.push("/auth/signin");
    return null;
  }

  const getAccountId = (provider: string) => {
    const account = accounts.find(account => account.providerId === provider);
    return account?.id || "";
  };

  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const userAccounts = await authClient.listAccounts();
        const { data, error } = userAccounts;
        if (data) {
          setAccounts(data);
        } else if (error) {
          const { code, message, status, statusText } = error;
          if ((code && code !== "") && (message && message !== "") && status > 0 && statusText !== "") {
            setError(`Failed to fetch account data.
              Error code: ${code} - ${message} (${status}: ${statusText})`
            );
          }
        }
      } catch (error) {
        setError(`Failed to fetch account data: ${error}`);
      }
    };

    fetchAccounts();
  },[]);

  const isLinked = (provider: string) => {
    return accounts.some(acc => acc.providerId === provider);
  };

  const handleUnlink = async (provider: string, accountId: string) => {
    if (!confirm(`Are you sure you want to unlink your ${provider} account?`)) {
      return;
    }

    const { data, error } = await authClient.unlinkAccount({
      providerId: provider,
      accountId
    });

    if (data && data.status) {
      setSuccessMessage("Account unlinked successfully");
    } else if (error) {
      const { code, message, status, statusText } = error;
      if ((code && code !== "") && (message && message !== "") && status > 0 && statusText !== "") {
        setError(`Failed to fetch account data.
          Error code: ${code} - ${message} (${status}: ${statusText})`
        );
      }
      setSuccessMessage("Could not unlink account");
    }
  };

  return (
    <div className="oauthSection flex flex-col gap-4">
      {error !== "" && <p className="text-red-500">{error}</p>}
      {successMessage !== "" && <p className="text-green-300">{successMessage}</p>}
      {/* Google */}
      {isLinked("google") ? (
        <div className="flex items-center justify-between border rounded p-3">
          <span className="text-sm text-gray-700">Google account linked</span>
          <span className="text-green-600 text-sm font-medium">Connected</span>
          <button
            type="button"
            title="Unlink Google"
            onClick={() => handleUnlink("google", getAccountId("google"))}
            className="text-red-500 text-xs hover:underline"
          >
            Unlink Google
          </button>
        </div>
      ) : (
        <button
          type="button"
          title="Connect Google"
          onClick={() => authClient.signIn.social({
            provider: "google"
          })}
          className="w-full flex items-center justify-center py-2 px-4 border rounded-md bg-white font-medium hover:bg-gray-50"
        >
          Connect Google
        </button>
      )}

      {/* GitHub */}
      {isLinked("github") ? (
        <div className="flex items-center justify-between border rounded p-3">
          <span className="text-sm text-gray-700">GitHub account linked</span>
          <span className="text-green-600 text-sm font-medium">Connected</span>
          <button
            type="button"
            title="Unlink GitHub"
            onClick={() => handleUnlink("github", getAccountId("github") )}
            className="text-red-500 text-xs hover:underline"
          >
            Unlink GitHub
          </button>
        </div>
      ) : (
        <button
          type="button"
          title="Connect GitHub"
          onClick={() => authClient.signIn.social({
            provider: "github"
          })}
          className="w-full flex items-center justify-center py-2 px-4 border rounded-md bg-white font-medium hover:bg-gray-50"
        >
          Connect GitHub
        </button>
      )}
    </div>
  );
};

export default OAuthSection;
