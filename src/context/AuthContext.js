import React, { createContext, useState, useEffect } from "react";
import api from "../services/api";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

export const AuthContext = createContext();

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:8000/api";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // 🔹 Restore user from token on app load
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        const now = Date.now() / 1000;

        if (decoded.exp > now) {
          setUser({ email: decoded.email, ...decoded });
        } else {
          refreshAccessToken();
        }
      } catch (err) {
        console.error("Invalid token", err);
      }
    }
    setLoading(false);
  }, []);

  // 🔹 Login user
  const login = async (email, password) => {
    setLoading(true);
   try {
     const res = await api.post("/auth/login/", { email, password });   
     localStorage.setItem("accessToken", res.data.tokens.access);
     localStorage.setItem("refreshToken", res.data.tokens.refresh); 
     const decoded = jwtDecode(res.data.tokens.access);
     setUser({ email: decoded.email, ...decoded });
   } catch (error) {
    console.log("Error while login:",error)
   }
  };

  // 🔹 Register user
  const register = async (data) => {
    await api.post("/register/", data);
  };

  // 🔹 Refresh token function
  const refreshAccessToken = async () => {
    try {
      const refreshToken = localStorage.getItem("refreshToken");
      if (!refreshToken) return logout();

      const res = await axios.post(`${API_BASE_URL}/token/refresh/`, {
        refresh: refreshToken,
      });

      localStorage.setItem("accessToken", res.data.access);

      const decoded = jwtDecode(res.data.access);
      setUser({ email: decoded.email, ...decoded });
      return res.data.access;
    } catch (err) {
      console.error("Refresh token failed", err);
      logout();
    }
  };

  // 🔹 Logout
  const logout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, login, register, logout, refreshAccessToken, loading }}
    >
      {children}
    </AuthContext.Provider>
  );
};
