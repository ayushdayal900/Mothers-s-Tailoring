import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [token, setToken] = useState(localStorage.getItem('token'));

    // Configure axios defaults
    if (token) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }

    // Load user on mount
    useEffect(() => {
        const loadUser = async () => {
            if (token) {
                try {
                    const res = await axios.get('http://localhost:5000/api/auth/me');
                    setUser(res.data);
                } catch (error) {
                    console.error("Failed to load user", error);
                    logout();
                }
            }
            setLoading(false);
        };

        loadUser();
    }, [token]);

    // Login
    const login = async (email, password) => {
        try {
            const res = await axios.post('http://localhost:5000/api/auth/login', { email, password });
            localStorage.setItem('token', res.data.token);
            setToken(res.data.token);
            setUser(res.data);
            axios.defaults.headers.common['Authorization'] = `Bearer ${res.data.token}`;
            return { success: true, role: res.data.role };
        } catch (error) {
            return { success: false, message: error.response?.data?.message || 'Login failed' };
        }
    };

    // Register
    const register = async (userData) => {
        try {
            const res = await axios.post('http://localhost:5000/api/auth/register', userData);
            localStorage.setItem('token', res.data.token);
            setToken(res.data.token);
            setUser(res.data);
            axios.defaults.headers.common['Authorization'] = `Bearer ${res.data.token}`;
            return { success: true };
        } catch (error) {
            return { success: false, message: error.response?.data?.message || 'Registration failed' };
        }
    };

    // Logout
    const logout = () => {
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
        delete axios.defaults.headers.common['Authorization'];
    };

    return (
        <AuthContext.Provider value={{ user, token, loading, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
};


