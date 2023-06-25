import { useState, createContext, ReactNode } from "react";

interface IBook {
  title: string;
  isbn: string;
  author: string;
  description?: string;
  published_date?: string;
  publisher?: string;
  updated_date?: Date
}

interface IUser {
  details: {
    firstName?: string;
    lastName?: string;
    email: string;
    password: string;
    confirmPassword?: string;
    books: IBook[]
  } | null;
  token?: {
    payload: {
      id: string;
    }
  } | null;
}

const User: IUser = {
  details: {
    email: "",
    password: "",
    books: []
  }
};

interface UserProviderProps {
  children: ReactNode;
}

interface IUserContext {
  userContext: IUser;
  setUserContext: (user: IUser) => void;
}

export const UserContext = createContext<IUserContext>({
  userContext: User,
  setUserContext: () => {}
});

export const UserProvider = ({ children }: UserProviderProps) => {
  const [state, setState] = useState(User);

  return (
    <UserContext.Provider value={ { userContext: state, setUserContext: setState } }>
      {children}
    </UserContext.Provider>
  );
};