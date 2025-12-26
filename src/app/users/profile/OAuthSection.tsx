"use client";
import { signIn } from "next-auth/react";
import { useUser } from "../../context/UserContext";

const OAuthSection = () => {
  const { user } = useUser();
  if (!user) {
    return null;
  }
  const account = user.accounts?.find(acc => acc.userId === user.id);

  const isLinked = (provider: string) => {
    return user.accounts?.some(acc => acc.provider === provider);
  };

  const handleUnlink = async (provider: string, accountId: string) => {
    if (!confirm(`Are you sure you want to unlink your ${provider} account?`)) {
      return;
    }

    const res = await fetch("/api/accounts", {
      method: "DELETE",
      body: JSON.stringify({ provider, providerAccountId: accountId })
    });

    if (res.ok) {
      window.location.reload();
    }
  };

  return (
    <div className="oauthSection flex flex-col gap-4">
      {/* Google */}
      {isLinked("google") ? (
        <div className="flex items-center justify-between border rounded p-3">
          <span className="text-sm text-gray-700">Google account linked</span>
          <span className="text-green-600 text-sm font-medium">Connected</span>
          <button
            type="button"
            title="Unlink Google"
            onClick={() => handleUnlink("google", account!.providerAccountId! )}
            className="text-red-500 text-xs hover:underline"
          >
            Unlink Google
          </button>
        </div>
      ) : (
        <button
          type="button"
          title="Connect Google"
          onClick={() => signIn("google")}
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
            onClick={() => handleUnlink("github", account!.providerAccountId! )}
            className="text-red-500 text-xs hover:underline"
          >
            Unlink GitHub
          </button>
        </div>
      ) : (
        <button
          type="button"
          title="Connect GitHub"
          onClick={() => signIn("github")}
          className="w-full flex items-center justify-center py-2 px-4 border rounded-md bg-white font-medium hover:bg-gray-50"
        >
          Connect GitHub
        </button>
      )}
    </div>
  );
};

export default OAuthSection;