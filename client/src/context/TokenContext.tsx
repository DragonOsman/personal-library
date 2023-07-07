import { createContext, ReactNode } from "react";

interface AccessToken {
  tokenData: string
};

const accessToken:AccessToken = {
  tokenData: ""
};

interface TokenProviderProps {
  children: ReactNode
};

export const TokenContext = createContext<AccessToken>(accessToken);

export const TokenContextProvider = ({ children }: TokenProviderProps) => {
  return (
    <TokenContext.Provider value={ { tokenData: accessToken.tokenData } }>
      {children}
    </TokenContext.Provider>);
};