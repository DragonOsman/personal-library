"use client";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

const ConfirmLinkClient = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const confirm = async () => {
    if (!token) {
      setError("Invalid or missing token");
      return;
    }
    setLoading(true);
    try {
      const response = await fetch("/api/link", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token })
      });
      const data = await response.json();
      if (data.success) {
        router.push("/auth/signin");
      } else {
        setError(data.error || "Failed to link account");
      }
    } catch (error: unknown) {
      setError(`Failed to link account: ${(error as Error).message}`);
    } finally {
      setLoading(false);
    }
  };

  const cancel = () => {
    router.push("/auth/signin");
  };

  return (
    <>
      <h1 className="text-xl font-bold mb-4 text-brand-primary">Confirm Account Linking</h1>
      <p className="mb-4">We detected that you already have an account. Do you want to link this provider to your existing account?</p>
        {error && <p className="text-red-500 mb-4">{error}</p>}
      <div className="flex gap-4">
        <button
          type="button"
          className="px-4 py-2 bg-green-500 text-white rounded"
          title="confirm linking"
          onClick={confirm}
          disabled={loading}
        >
          {loading ? "Linking..." : "Confirm"}
        </button>
        <button
          type="button"
          className="px-4 py-2 bg-gray-300 rounded"
          title="cancel linking"
          onClick={cancel}
        >
          Cancel
        </button>
      </div>
    </>
  );
};

export default ConfirmLinkClient;