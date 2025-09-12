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
                    fetchUSerData()
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

    const fetchUSerData = async() => {
        const res = await api.get("auth/profile")
        setUser(res.data)
    }

   const updateUserProfile = async() => {
        try {
            const res = await api.put("auth/profile/", user);
            setUser(res.data); 
            alert("Profile updated successfully!");
        } catch (err) {
            console.error("Update failed", err);
        }
    }


    // 🔹 Login user
const login = async (email, password) => {
    setLoading(true);
    try {
        const res = await api.post("/auth/login/", { email, password });
        
        // Only set tokens and user if 2FA is not required
        if (!res.data.requires_2fa) {
            localStorage.setItem("accessToken", res.data.tokens.access);
            localStorage.setItem("refreshToken", res.data.tokens.refresh);
            const decoded = jwtDecode(res.data.tokens.access);
            setUser({ email: decoded.email, ...decoded });
        }
        
        return res; // Return full response
    } catch (error) {
        console.log("Error while login:", error);
        throw error; // Re-throw to handle in LoginPage
    } finally {
        setLoading(false);
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
            value={{ user, loading, login, register, logout, refreshAccessToken, setUser,fetchUSerData, updateUserProfile,}}
        >
            {children}
        </AuthContext.Provider>
    );
};
