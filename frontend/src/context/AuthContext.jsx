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

    // Inactivity Tracker
    useEffect(() => {
        if (!user) return; // Only track if user is logged in

        const INACTIVITY_LIMIT = 30 * 1000; // 30 seconds for testing

        const updateActivity = () => {
            // Simple throttling: only update if 1 second has passed since last update
            const now = Date.now();
            const lastUpdate = parseInt(localStorage.getItem('lastActivity') || '0', 10);
            if (now - lastUpdate > 1000) {
                localStorage.setItem('lastActivity', now.toString());
            }
        };

        const checkInactivity = () => {
            const lastActivity = localStorage.getItem('lastActivity');
            if (lastActivity) {
                const diff = Date.now() - parseInt(lastActivity, 10);
                if (diff > INACTIVITY_LIMIT) {
                    console.log('User inactive for too long, logging out...');
                    logout();
                    alert('You have been logged out due to inactivity.');
                }
            } else {
                localStorage.setItem('lastActivity', Date.now().toString());
            }
        };

        // Listeners for activity
        window.addEventListener('mousemove', updateActivity);
        window.addEventListener('keydown', updateActivity);
        window.addEventListener('click', updateActivity);
        window.addEventListener('scroll', updateActivity);

        // Check every second (for precise 30s testing)
        const intervalId = setInterval(checkInactivity, 1000);

        // Initial check on mount/login
        localStorage.setItem('lastActivity', Date.now().toString());

        return () => {
            window.removeEventListener('mousemove', updateActivity);
            window.removeEventListener('keydown', updateActivity);
            window.removeEventListener('click', updateActivity);
            window.removeEventListener('scroll', updateActivity);
            clearInterval(intervalId);
        };
    }, [user]); // Re-run when user status changes

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


