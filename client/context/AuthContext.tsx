import React, { createContext, useEffect, useReducer, ReactNode } from "react";
import axios from "axios";
import { get } from "http";

type StateType = {
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
  } | null
};

const initialState = {
  isAuthenticated: false,
  user: null
};

interface AuthAction {
  type: string,
  payload: {
    user: {
      id: string
    } | null
  }
};

const authReducer = (state: StateType, { type, payload }: AuthAction): StateType => {
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
    default:
      return state;
  }
};

const AuthContext = createContext({
  ...initialState,
  logIn: () => Promise.resolve(),
  register: () => Promise.resolve(),
  logOut: () => Promise.resolve()
});

interface AuthProviderProps {
  children: ReactNode
};

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  const getUserInfo = async () => {
    const token = localStorage.getItem("token");

    if (token) {
      try {
        const res = await axios.get("/api/user/info");
        axios.defaults.headers.common["x-auth-token"] = token;

        dispatch({
          type: "LOGIN",
          payload: {
            user: res.data.user
          }
        });
      } catch (err) {
        console.error(err);
      }
    } else {
      delete axios.defaults.headers.common["x-auth-token"];
    }
  };

  useEffect(() => {
    if (!state.user) {
      getUserInfo();
    }
  }, [state]);

  const logIn = async (email:string, password:string) => {
    const config = {
      headers: { "Content-Type": "application/json" }
    };

    const body = JSON.stringify({ email, password });

    try {
      const res = await axios.post("/api/users/login", body, config);
      localStorage.setItem("token", res.data.token);
      await getUserInfo();
    } catch (err) {
      console.error(err);
    }
  };

  const register = async (firstname:string, lastname:string, email:string, password:string) => {
    const config = {
      headers: { "Content-Type": "application/json" }
    };
    const body = JSON.stringify({ firstname, lastname, email, password });

    try {
      const res = await axios.post("/api/users/register", body, config);
      localStorage.setItem("token", res.data.token);
      await getUserInfo();
    } catch (err) {
      console.error(err);
    }
  };

  const logOut = async (firstname:string, lastname:string, email:string, password:string) => {
    try {
      localStorage.removeItem("token");
      dispatch({
        type: "LOGOUT"
      });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <AuthContext.Provider value={{ ...state, logIn, register, logOut }}>
      {children}
    </AuthContext.Provider>
  );
};