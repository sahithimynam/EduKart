import React, { createContext, useContext, useState, useEffect } from "react";
import { api } from "../services/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem("edukart_user");
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [token, setToken] = useState(() => localStorage.getItem("edukart_token") || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function verifyToken() {
      if (token) {
        try {
          const profile = await api.auth.me();
          setUser(profile);
          localStorage.setItem("edukart_user", JSON.stringify(profile));
        } catch (err) {
          console.warn("Session expired or invalid token, clearing session.");
          logout();
        }
      }
      setLoading(false);
    }
    verifyToken();
  }, [token]);

  const saveAuth = (authData) => {
    setToken(authData.token);
    setUser(authData.user);
    localStorage.setItem("edukart_token", authData.token);
    localStorage.setItem("edukart_user", JSON.stringify(authData.user));
  };

  const login = async (email, password) => {
    const data = await api.auth.login({ email, password });
    saveAuth(data);
    return data;
  };

  const register = async (userData) => {
    const data = await api.auth.register(userData);
    saveAuth(data);
    return data;
  };

  const demoLogin = async (role = "user") => {
    const data = await api.auth.demoLogin(role);
    saveAuth(data);
    return data;
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("edukart_token");
    localStorage.removeItem("edukart_user");
  };

  const updateProfile = async (updateData) => {
    const res = await api.auth.updateProfile(updateData);
    if (res.user) {
      setUser(res.user);
      localStorage.setItem("edukart_user", JSON.stringify(res.user));
    }
    return res;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated: !!user,
        isAdmin: user?.role === "admin",
        login,
        register,
        demoLogin,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
