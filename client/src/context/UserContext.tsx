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
  firstName?: string;
  lastName?: string;
  email: string;
  password: string;
  confirmPassword?: string;
  token?: {
    payload: {
      id: string;
    }
  };
  books?: IBook[]
}

const User: IUser = {
  email: "",
  password: "",
};

interface UserProviderProps {
  children: ReactNode;
}

interface IUserContext {
  user: IUser;
  setUser: (user: IUser) => void;
}

export const UserContext = createContext<IUserContext>({
  user: User,
  setUser: () => {}
});

export const UserProvider = ({ children }: UserProviderProps) => {
  const [state, setState] = useState(User);

  return (
    <UserContext.Provider value={ { user: state, setUser: setState } }>
      {children}
    </UserContext.Provider>
  );
};