import React, { useState, useEffect, useContext, createContext } from "react";
import {useNavigate} from 'react-router-dom';

const AuthContext = createContext();


// Hook to use Auth Context
export function useAuth() {
  return useContext(AuthContext);
}

// Provider Component
export function AuthProvider({ children }) {
  const [authUser, setAuthUser] = useState(() => {
    // Load user from localStorage on initial render
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const [isLoggedIn, setIsLoggedIn] = useState(!!authUser);
  const navigate = useNavigate();

  // Keep isLoggedIn synced with authUser
  useEffect(() => {
    setIsLoggedIn(!!authUser);
  }, [authUser]);

  // Login: Save user to state and localStorage
  const login = (user) => {
    setAuthUser(user);
    localStorage.setItem("user", JSON.stringify(user));
  };

  // Logout: Clear user from state and localStorage
  const logout = () => {
    setAuthUser(null);
    localStorage.removeItem("user");
    navigate("/signin");
  };

  const values = {
    authUser,
    isLoggedIn,
    login,
    logout,
  };

  return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>;
}
