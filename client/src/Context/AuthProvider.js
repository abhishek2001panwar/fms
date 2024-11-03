'use client';
import React, { createContext, useState } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

// Set base URL for the API
const API_BASE_URL = 'http://localhost:4000/api/v1/user';

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null); // For error handling
    const [isLoggedIn, setIsLoggedIn] = useState(false); // State to manage login status

    const register = async (name, email, password) => {
        setLoading(true); // Set loading state to true
        try {
            const response = await axios.post(`${API_BASE_URL}/register`, { name, email, password });
            setUser(response.data.user); // Set user after registration
            localStorage.setItem('token', response.data.token); // Store token if returned
            setIsLoggedIn(true); // Update login status
        } catch (err) {
            console.error('Registration failed', err);
            setError(err.response?.data.message || 'Registration failed'); // Use server error message if available
        } finally {
            setLoading(false); // Ensure loading is set to false
        }
    };

    const login = async (credentials) => {
        setLoading(true); // Set loading state to true
        try {
            const response = await axios.post(`${API_BASE_URL}/login`, credentials, { withCredentials: true });
            const { token, user: loggedInUser } = response.data; // Rename user to loggedInUser for clarity
            localStorage.setItem('token', token); // Store token
            setUser(loggedInUser); // Set user data directly on login
            setIsLoggedIn(true); // Update login status
        } catch (err) {
            console.error('Login failed', err);
            setError(err.response?.data.message || 'Login failed'); // Use server error message if available
        } finally {
            setLoading(false); // Ensure loading is set to false
        }
    };

    const logout = async () => {
        setLoading(true); // Set loading state to true
        try {
            await axios.get(`${API_BASE_URL}/logout`, { withCredentials: true });
            localStorage.removeItem('token'); // Remove token on logout
            setUser(null); // Clear user on logout
            setIsLoggedIn(false); // Update login status
        } catch (err) {
            console.error('Logout failed', err);
            setError(err.response?.data.message || 'Logout failed'); // Use server error message if available
        } finally {
            setLoading(false); // Ensure loading is set to false
        }
    };

    return (
        <AuthContext.Provider value={{ user, loading, error, isLoggedIn, register, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
