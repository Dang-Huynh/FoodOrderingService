import React, { createContext, useContext, useState, useEffect } from "react";
import jwt_decode from "jwt-decode";
import axios from "axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // helper to persist tokens and set axios auth header
  const applyTokens = (access, refresh) => {
    if (access) {
      localStorage.setItem("access_token", access);
      axios.defaults.headers.common["Authorization"] = `Bearer ${access}`;
      try {
        const decoded = jwt_decode(access);
        setUser({ email: decoded.email, id: decoded.user_id });
      } catch {
        // bad/expired token
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        delete axios.defaults.headers.common["Authorization"];
        setUser(null);
      }
    } else {
      localStorage.removeItem("access_token");
      delete axios.defaults.headers.common["Authorization"];
      setUser(null);
    }
    if (refresh) localStorage.setItem("refresh_token", refresh);
  };

  // Login
  const login = async (email, password) => {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/accounts/login/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      throw new Error(data.detail || "Invalid credentials");
    }

    const data = await res.json(); // { access, refresh } expected
    applyTokens(data.access, data.refresh);
  };

  // Register
  const register = async ({ full_name, email, password }) => {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/accounts/register/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ full_name, email, password }),
    });

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      throw new Error(data.detail || "Registration failed");
    }

    const data = await res.json(); // { access, refresh } expected
    applyTokens(data.access, data.refresh);
  };

  // Logout
  function logout() {
  delete axios.defaults.headers.common["Authorization"];
  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");
  setUser(null);
}

  // Load user on init
  useEffect(() => {
    const access = localStorage.getItem("access_token");
    const refresh = localStorage.getItem("refresh_token");
    if (access) applyTokens(access, refresh || null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
