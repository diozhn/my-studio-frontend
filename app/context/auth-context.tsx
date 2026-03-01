"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { loginAuth, LoginAuth, LoginAuthResponse } from "@/app/services/auth/login";

interface AuthContextValue {
  token: string | null;
  refreshToken: string | null;
  isSuperuser: boolean;
  isAuthenticated: boolean;
  login: (credentials: LoginAuth) => Promise<LoginAuthResponse | null>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const ACCESS_TOKEN_KEY = "auth_token";
const REFRESH_TOKEN_KEY = "auth_refresh_token";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);
  const [isSuperuser, setIsSuperuser] = useState<boolean>(false);
  useEffect(() => {
    if (typeof window === "undefined") return;

    const storedToken = window.localStorage.getItem(ACCESS_TOKEN_KEY);
    const storedRefreshToken = window.localStorage.getItem(REFRESH_TOKEN_KEY);

    if (storedToken) setToken(storedToken);
    if (storedRefreshToken) setRefreshToken(storedRefreshToken);
  }, []);

  const login = async (credentials: LoginAuth) => {
    try {
      const response = await loginAuth(credentials);

      if (response.token) {
        setToken(response.token);
        if (typeof window !== "undefined") {
          window.localStorage.setItem(ACCESS_TOKEN_KEY, response.token);
        }
      }

      if (response.refresh_token) {
        setRefreshToken(response.refresh_token);
        if (typeof window !== "undefined") {
          window.localStorage.setItem(REFRESH_TOKEN_KEY, response.refresh_token);
        }
      }

      if (response.is_superuser) {
        setIsSuperuser(response.is_superuser);
        if (typeof window !== "undefined") {
          window.localStorage.setItem("is_superuser", response.is_superuser.toString());
        }
      }

      return response;
    } catch (error) {
      console.error("Erro ao efetuar login:", error);
      throw error;
    }
  };

  const logout = () => {
    setToken(null);
    setRefreshToken(null);
    setIsSuperuser(false);
    if (typeof window !== "undefined") {
      window.localStorage.removeItem(ACCESS_TOKEN_KEY);
      window.localStorage.removeItem(REFRESH_TOKEN_KEY);
      window.localStorage.removeItem("is_superuser");
    }
  };

  const value: AuthContextValue = {
    token,
    refreshToken,
    isAuthenticated: !!token,
    login,
    logout,
    isSuperuser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth deve ser usado dentro de um AuthProvider");
  }
  return context;
}


