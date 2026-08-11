"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode
} from "react";
import { authClient } from "@/auth-client";
import {
  TileSize,
  ViewMode,
  SortOrder
} from "@/app/generated/prisma/client";

interface UserSettings {
  showBookCovers: boolean;
  showRatings: boolean;
  showDescriptions: boolean;
  viewMode: ViewMode;
  tileSize: TileSize;
  booksPerPage: number;
  defaultSort: SortOrder;
}

interface UserSettingsContextValue {
  settings: UserSettings | null;
  isLoading: boolean;
  error: string | null;

  updateSettings: (
    settings: Partial<UserSettings>
  ) => Promise<void>;
}

const UserSettingsContext =
  createContext<UserSettingsContextValue | undefined>(undefined);

interface UserSettingsProviderProps {
  children: ReactNode;
}

export function UserSettingsProvider({
  children
}: UserSettingsProviderProps) {
  const { data: session, isPending: sessionPending } =
    authClient.useSession();

  const [settings, setSettings] =
    useState<UserSettings | null>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadSettings = useCallback(async () => {
    if (!session?.user) {
      setSettings(null);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/user-settings", {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json"
        }
      });

      if (!response.ok) {
        throw new Error(
          `Failed to load user settings: ${response.status}`
        );
      }

      const data = await response.json();

      setSettings(data.settings);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to load user settings."
      );
    } finally {
      setIsLoading(false);
    }
  }, [session?.user]);

  useEffect(() => {
    if (!sessionPending) {
      void loadSettings();
    }
  }, [sessionPending, loadSettings]);

  const updateSettings = useCallback(
    async (updates: Partial<UserSettings>) => {
      setError(null);

      try {
        const response = await fetch("/api/user-settings", {
          method: "PATCH",
          credentials: "include",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(updates)
        });

        if (!response.ok) {
          const data = await response.json().catch(() => null);

          throw new Error(
            data?.message ??
              `Failed to update user settings: ${response.status}`
          );
        }

        const data = await response.json();

        setSettings(data.settings);
      } catch (err) {
        const message =
          err instanceof Error
            ? err.message
            : "Failed to update user settings.";

        setError(message);
        throw err;
      }
    },
    []
  );

  return (
    <UserSettingsContext.Provider
      value={{
        settings,
        isLoading,
        error,
        updateSettings
      }}
    >
      {children}
    </UserSettingsContext.Provider>
  );
}

export function useUserSettings(): UserSettingsContextValue {
  const context = useContext(UserSettingsContext);

  if (!context) {
    throw new Error(
      "useUserSettings must be used inside a UserSettingsProvider"
    );
  }

  return context;
}