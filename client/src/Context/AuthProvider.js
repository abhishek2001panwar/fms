'use client';
import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

export const AuthContext = createContext();

// Set base URL for the API
const API_BASE_URL = `${process.env.NEXT_PUBLIC_API_URL}api/v1/user`;
console.log("API URL:", API_BASE_URL); // Logs: https://your-backend.onrender.com


export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null); // User object
    const [authLoading, setAuthLoading] = useState(true); // Global loading state for authentication
    const [actionLoading, setActionLoading] = useState(false); // Loading state for actions like login/register/logout
    const [error, setError] = useState(null); // Error handling state
    const [isLoggedIn, setIsLoggedIn] = useState(false); // Tracks login status
    const router = useRouter();

    // Persist Authentication State on Refresh
    useEffect(() => {
        const checkAuthStatus = async () => {
            const token = localStorage.getItem('token'); // Check token in localStorage (if used)
            if (token) {
                try {
                    const response = await axios.get(`${API_BASE_URL}/auth-status`, {
                        headers: { Authorization: `Bearer ${token}` },
                        withCredentials: true, // Use if cookies are sent
                    });
                    setUser(response.data.user); // Set user if token is valid
                    setIsLoggedIn(true); // Mark user as logged in
                } catch (err) {
                    console.error('Failed to verify token:', err);
                    localStorage.removeItem('token'); // Remove invalid token
                    setIsLoggedIn(false);
                    setUser(null);
                }
            } else {
                setIsLoggedIn(false); // No token, set login status to false
            }
            setAuthLoading(false); // Finish loading after state is updated
        };

        checkAuthStatus();
    }, []);

    // Registration Function
    const register = async (name, email, password) => {
        setActionLoading(true);
        try {
            const response = await axios.post(`${API_BASE_URL}/register`, { name, email, password });
            setUser(response.data.user); // Set user data
            localStorage.setItem('token', response.data.token); // Store token in localStorage
            setIsLoggedIn(true);
        } catch (err) {
            console.error('Registration failed', err);
            setError(err.response?.data.message || 'Registration failed');
        } finally {
            setActionLoading(false);
        }
    };

    // Login Function
    const login = async (credentials) => {
        setActionLoading(true);
        try {
            const response = await axios.post(`${API_BASE_URL}/login`, credentials, { withCredentials: true });
            const { token, user: loggedInUser } = response.data;
            localStorage.setItem('token', token); // Store token in localStorage
            setUser(loggedInUser); // Set user data
            setIsLoggedIn(true); // Update login state
        } catch (err) {
            console.error('Login failed', err.message);
            setError(err.response?.data.message || 'Login failed');
        } finally {
            setActionLoading(false);
        }
    };

    // Logout Function
    const logout = async () => {
        setActionLoading(true);
        try {
            await axios.get(`${API_BASE_URL}/logout`, { withCredentials: true });
            localStorage.removeItem('token'); // Remove token on logout
            setUser(null); // Clear user state
            setIsLoggedIn(false); // Update login state
            await router.push('/'); // Ensure redirection happens after logout
        } catch (err) {
            console.error('Logout failed', err);
            setError(err.response?.data.message || 'Logout failed');
        } finally {
            setActionLoading(false);
        }
    };

    // Provide Auth Context
    return (
        <AuthContext.Provider
            value={{
                user,
                loading: authLoading || actionLoading, // Combine both loading states
                error,
                isLoggedIn,
                register,
                login,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};
