"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { API_BASE_URL } from "@/lib/config";

interface User {
  id: number;
  email: string;
  is_active: boolean;
  role: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => void;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setToken(storedToken);
      fetchUser(storedToken);
    } else {
      setLoading(false);
    }
  }, []);

  const clearError = () => setError(null);

  const fetchUser = async (authToken: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/me`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
        credentials:"include"
      });
      if (response.ok) {
        const data = await response.json();
        setUser(data);
      } else {
        localStorage.removeItem("token");
        setToken(null);
      }
    } catch (err: any) {
      console.error("Failed to fetch user", err);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      const formData = new URLSearchParams();
      formData.append("username", email);
      formData.append("password", password);

      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: formData,
        credentials:"include"
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        let errorMsg = errorData?.detail;
        if (typeof errorMsg === 'object' && errorMsg !== null && errorMsg.length > 0) {
          // Sometimes FastAPI validation errors are arrays
           errorMsg = errorMsg[0]?.msg || JSON.stringify(errorMsg);
        }
        throw new Error(errorMsg || "Login failed");
      }

      const data = await response.json();
      const accessToken = data.access_token;
      
      localStorage.setItem("token", accessToken);
      setToken(accessToken);
      
      await fetchUser(accessToken);
    } catch (err: any) {
      setError(err.message || "An error occurred during login");
    } finally {
      setLoading(false);
    }
  };

  const register = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
        credentials:"include"
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        let errorMsg = errorData?.detail;
        if (typeof errorMsg === 'object' && errorMsg !== null && errorMsg.length > 0) {
           errorMsg = errorMsg[0]?.msg || JSON.stringify(errorMsg);
        }
        throw new Error(errorMsg || "Registration failed");
      }

      // After successful registration, log the user in
      await login(email, password);
    } catch (err: any) {
      setError(err.message || "An error occurred during registration");
    } finally {
      setLoading(false);
    }
  };

  const refreshAccessToken = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({}),
        credentials: "include",
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        let errorMsg = errorData?.detail;
        if (typeof errorMsg === 'object' && errorMsg !== null && errorMsg.length > 0) {
           errorMsg = errorMsg[0]?.msg || JSON.stringify(errorMsg);
        }
        throw new Error(errorMsg || "Refresh token failed");
      }

      const data = await response.json();
      const accessToken = data.access_token;
      
      localStorage.setItem("token", accessToken);
      setToken(accessToken);
      
      await fetchUser(accessToken);
    } catch (err: any) {
      setError(err.message || "An error occurred during refresh token");
    } finally {
      setLoading(false);
    }
  }

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, token, loading, error, login, register, logout, clearError }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
