import React, { createContext, useContext, useState, ReactNode } from "react";

type Book = {
  id: string;
  title: string;
  author: string;
  isbn?: string;
};

type Library = {
  books: Book[];
};

type User = {
  id: string;
  name: string;
  avatarUrl?: string;
  email: string;
  library?: Library;
};

type UserContextType = {
  user: User | null;
  setUser: (user: User | null) => void;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  return (
    <UserContext.Provider value={{ user, setUser }}>
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