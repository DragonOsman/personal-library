import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { IBook } from "./BookContext";
import { useSession } from "next-auth/react";

type Account = {
  id?: string;
  userId?: string;
  provider: string;
  providerAccountId: string;
  type?: string;
  refreshToken?: string | null;
  accessToken?: string | null;
  scope?: string | null;
  tokenType?: string | null;
  expiresAt?: number | null;
};

type Email = {
  id?: string;
  email: string;
  userId?: string;
};

type User = {
  id?: string | null | undefined;
  name?: string | null | undefined;
  image?: string | null | undefined;
  email?: string | null | undefined;
  emails: Email[];
  emailVerified?: Date | null | undefined;
  mfaEnabled?: boolean | null | undefined;
  mfaSecret?: string | null | undefined;
  autoMergeAuth?: boolean | null | undefined;
  accounts?: Account[] | null | undefined;
};

type UserContextType = {
  user: User | null;
  setUser: (user: User | null) => void;
  loading: boolean;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export default function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "loading") {
      return;
    }

    if (status !== "authenticated" ) {
      setUser(null);
      setLoading(false);
    }

    const fetchUser = async () => {
      const res = await fetch("/api/users/me", {
        method: "GET",
        headers: {
          "Content-Type": "application/json"
        }
      });

      try {
        if (res.ok) {
          const userData: User = await res.json();
          setUser(userData);
          setLoading(false);
        }
      } catch (error) {
        console.error(`An error occurred while fetching user data: ${(error as Error).message}`);
        setUser(null);
        setLoading(false);
      }
    };

    fetchUser();
  }, [status]);

  return (
    <UserContext.Provider value={{ user, setUser, loading }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}