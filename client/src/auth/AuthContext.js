import React, { createContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchUser } from '../utils/api';

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(null);
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {

        const token = localStorage.getItem('token');
        if (token) {
            setToken(token);

            const base64Url = token.split('.')[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
                return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
            }).join(''));
            const { id } = JSON.parse(jsonPayload);

            fetchUser(id, token).then(() => {
                localStorage.setItem('userId', id);
                const authRoutes = ['/login', '/signup', '/complete-setup', '/forgot-password'];
                if (authRoutes.includes(window.location.pathname)) {
                    navigate('/home');
                }
            }).catch(() => {
                localStorage.removeItem('token');
                navigate('/login');
            });

        } else {
            const authRoutes = ['/login', '/signup', '/complete-setup', '/forgot-password'];
            if (!authRoutes.includes(window.location.pathname)) {
                navigate('/login');
            }
        }
    }, [navigate]);

    return (
        <AuthContext.Provider value={{ token, user, setUser }}>
            {children}
        </AuthContext.Provider>
    );
}

export { AuthContext, AuthProvider };