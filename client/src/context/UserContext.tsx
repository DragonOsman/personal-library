import { createContext, ReactNode } from "react";

interface UserInterface {
  email: string;
  password: string;
  token?: {
    payload: {
      id: string;
    }
  };
}

const User: UserInterface = {
  email: "",
  password: "",
  token: {
    payload: {
      id: ""
    }
  }
};

interface UserProviderProps {
  children: ReactNode;
}

const dispatchUser = (User: UserInterface) => User;

const UserContext = createContext({userContext: User, setUserContext: dispatchUser});

const UserProvider = ({ children }: UserProviderProps) => {
  const userContext = User;
  const setUserContext = dispatchUser;

  return (
    <UserContext.Provider value={{ userContext, setUserContext }}>
      {children}
    </UserContext.Provider>
  );
};

export { UserContext, UserProvider, User };