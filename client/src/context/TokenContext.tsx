import { createContext, ReactNode, useState } from "react";

interface AccessToken {
  tokenData: string | null,
  setTokenData: (tokenData: AccessToken) => void
};

const accessToken:AccessToken = {
  tokenData: "",
  setTokenData: function(tokenData: AccessToken) { tokenData.tokenData = this.tokenData; }
};

interface TokenProviderProps {
  children: ReactNode
};

export const TokenContext = createContext<AccessToken>(accessToken);

export const TokenContextProvider = ({ children }: TokenProviderProps) => {
  const [state, setState] = useState(accessToken);

  return (
    <TokenContext.Provider value={ { tokenData: state.tokenData, setTokenData: setState } }>
      {children}
    </TokenContext.Provider>);
};