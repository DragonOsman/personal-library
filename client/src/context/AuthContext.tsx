import { createContext, useEffect, useReducer, ReactNode } from "react";
import axios from "axios";

type StateProps = {
  isAuthenticated: boolean,
  user: {
    _id: string,
    id: string,
    firstname: string,
    lastname: string,
    email: string,
    password: string,
    kind: string,
    books: []
  }
};

const initialState = {
  isAuthenticated: false,
  user: null
};

type AuthReducerProps = {
  type: string,
  payload: {
    user: {
      id: string
    }
  }
};

const authReducer = (state: StateProps, { type, payload }: AuthReducerProps) => {
  switch (type) {
    case "LOGIN":
      return {
        ...state,
        isAuthenticated: true,
        user: payload.user
      };
    case "LOGOUT":
      return {
        ...state,
        isAuthenticated: false,
        user: null
      };
  }
};

const AuthContext = createContext({
  ...initialState,
  logIn: () => Promise.resolve(),
  register: () => Promise.resolve(),
  logOut: () => Promise.resolve()
});

type AuthProviderProps = {
  children: ReactNode
};

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [state, dispatch] = useReducer(initialState, authReducer);

  const getUserInfo = async () => {
    const token = localStorage.getItem("token");
  };
};