import React, { createContext, useContext, useState, useEffect } from "react";
import jwt_decode from "jwt-decode";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // Login
  const login = async (email, password) => {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/accounts/login/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (!res.ok) throw new Error("Invalid credentials");

    const data = await res.json();
    localStorage.setItem("token", data.access);

    const decoded = jwt_decode(data.access);
    setUser({ email: decoded.email, id: decoded.user_id });
  };

  // Register
  const register = async ({ full_name, email, password }) => {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/accounts/register/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ full_name, email, password }),
    });

    if (!res.ok) throw new Error("Registration failed");

    const data = await res.json();
    localStorage.setItem("token", data.access);

    const decoded = jwt_decode(data.access);
    setUser({ email: decoded.email, id: decoded.user_id });
    return decoded;
  };

  // Logout
  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  // Load user on init
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwt_decode(token);
        setUser({ email: decoded.email, id: decoded.user_id });
      } catch {
        localStorage.removeItem("token");
      }
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
