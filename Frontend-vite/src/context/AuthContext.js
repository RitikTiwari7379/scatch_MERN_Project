import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [owner, setOwner] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  // Helper function to clear all auth cookies manually
  const clearAllCookies = () => {
    // Clear authentication cookies manually from frontend
    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie =
      "ownertoken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  };

  const checkAuth = async () => {
    try {
      const response = await axios.get("/api/auth/check");
      if (response.data.user) {
        setUser(response.data.user);
      }
      if (response.data.owner) {
        setOwner(response.data.owner);
      }
    } catch (error) {
      console.log("No active session");
      // Clear any stale cookies if auth check fails
      clearAllCookies();
      setUser(null);
      setOwner(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      const response = await axios.post("/users/login", { email, password });
      if (response.data.success) {
        await checkAuth();
        return { success: true };
      }
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || "Login failed",
      };
    }
  };

  const register = async (fullname, email, password) => {
    try {
      const response = await axios.post("/users/register", {
        fullname,
        email,
        password,
      });
      if (response.data.success) {
        await checkAuth();
        return { success: true };
      }
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || "Registration failed",
      };
    }
  };

  const adminLogin = async (email, password) => {
    try {
      const response = await axios.post("/owners/login", { email, password });
      if (response.data.success) {
        await checkAuth();
        return { success: true };
      }
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || "Admin login failed",
      };
    }
  };

  const adminRegister = async (fullname, email, password) => {
    try {
      const response = await axios.post("/owners/create", {
        fullname,
        email,
        password,
      });
      if (response.data.success) {
        return { success: true };
      }
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || "Admin registration failed",
      };
    }
  };

  const logout = async () => {
    try {
      await axios.get("/users/logout");
      setUser(null);
      setOwner(null); // Clear both states
      clearAllCookies(); // Ensure cookies are cleared
      // Force a full auth check to ensure clean state
      await checkAuth();
    } catch (error) {
      console.error("Logout error:", error);
      // Even if logout request fails, clear local state and cookies
      setUser(null);
      setOwner(null);
      clearAllCookies();
    }
  };

  const adminLogout = async () => {
    try {
      await axios.get("/owners/logout");
      setOwner(null);
      setUser(null); // Clear both states
      clearAllCookies(); // Ensure cookies are cleared
      // Force a full auth check to ensure clean state
      await checkAuth();
    } catch (error) {
      console.error("Admin logout error:", error);
      // Even if logout request fails, clear local state and cookies
      setUser(null);
      setOwner(null);
      clearAllCookies();
    }
  };

  const value = {
    user,
    owner,
    loading,
    login,
    register,
    adminLogin,
    adminRegister,
    logout,
    adminLogout,
    checkAuth,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
