'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { adminAuthApi } from './api/admin-auth';

interface Admin {
    id: string;
    email: string;
    role: string;
}

interface AdminAuthContextType {
    admin: Admin | null;
    token: string | null;
    isAuthenticated: boolean;
    login: (email: string, password: string) => Promise<void>;
    logout: () => void;
    isLoading: boolean;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

export function AdminAuthProvider({ children }: { children: ReactNode }) {
    const [admin, setAdmin] = useState<Admin | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Load from localStorage
    useEffect(() => {
        const savedToken = localStorage.getItem('admin_token');
        const savedAdmin = localStorage.getItem('admin_user');

        if (savedToken && savedAdmin) {
            try {
                setToken(savedToken);
                setAdmin(JSON.parse(savedAdmin));
            } catch (error) {
                console.error('Failed to load admin auth:', error);
                localStorage.removeItem('admin_token');
                localStorage.removeItem('admin_user');
            }
        }
        setIsLoading(false);
    }, []);

    const login = async (email: string, password: string) => {
        try {
            const response = await adminAuthApi.login({ email, password });

            setToken(response.access_token);
            setAdmin(response.admin);

            localStorage.setItem('admin_token', response.access_token);
            localStorage.setItem('admin_user', JSON.stringify(response.admin));
        } catch (error) {
            console.error('Admin login failed:', error);
            throw error;
        }
    };

    const logout = () => {
        setToken(null);
        setAdmin(null);
        localStorage.removeItem('admin_token');
        localStorage.removeItem('admin_user');
    };

    return (
        <AdminAuthContext.Provider
            value={{
                admin,
                token,
                isAuthenticated: !!token && !!admin,
                login,
                logout,
                isLoading,
            }}
        >
            {children}
        </AdminAuthContext.Provider>
    );
}

export function useAdminAuth() {
    const context = useContext(AdminAuthContext);
    if (context === undefined) {
        throw new Error('useAdminAuth must be used within AdminAuthProvider');
    }
    return context;
}
