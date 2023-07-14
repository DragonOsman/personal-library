import { useState, createContext, ReactNode } from "react";

export interface IUser {
  details?: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    confirmPassword?: string;
  } | null;
  token: string | null;
}

const User: IUser = {
  details: {
    firstName: "",
    lastName: "",
    email: "",
    password: ""
  },
  token: ""
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