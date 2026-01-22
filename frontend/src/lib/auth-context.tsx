'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authApi } from './api/auth';
import type { AuthResponse } from './api/auth';

interface Customer {
    id: string;
    email: string;
    firstName?: string;
    lastName?: string;
}

interface AuthContextType {
    customer: Customer | null;
    token: string | null;
    isAuthenticated: boolean;
    login: (email: string, password: string) => Promise<void>;
    register: (email: string, password: string, firstName?: string, lastName?: string) => Promise<void>;
    logout: () => void;
    isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [customer, setCustomer] = useState<Customer | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Load auth from localStorage on mount
    useEffect(() => {
        const savedToken = localStorage.getItem('auth_token');
        const savedCustomer = localStorage.getItem('auth_customer');

        if (savedToken && savedCustomer) {
            try {
                setToken(savedToken);
                setCustomer(JSON.parse(savedCustomer));
            } catch (error) {
                console.error('Failed to load auth from localStorage:', error);
                localStorage.removeItem('auth_token');
                localStorage.removeItem('auth_customer');
            }
        }
        setIsLoading(false);
    }, []);

    const login = async (email: string, password: string) => {
        try {
            const response = await authApi.login({ email, password });

            setToken(response.access_token);
            setCustomer(response.customer);

            localStorage.setItem('auth_token', response.access_token);
            localStorage.setItem('auth_customer', JSON.stringify(response.customer));
        } catch (error) {
            console.error('Login failed:', error);
            throw error;
        }
    };

    const register = async (email: string, password: string, firstName?: string, lastName?: string) => {
        try {
            const response = await authApi.register({
                email,
                password,
                firstName,
                lastName,
            });

            setToken(response.access_token);
            setCustomer(response.customer);

            localStorage.setItem('auth_token', response.access_token);
            localStorage.setItem('auth_customer', JSON.stringify(response.customer));
        } catch (error) {
            console.error('Registration failed:', error);
            throw error;
        }
    };

    const logout = () => {
        setToken(null);
        setCustomer(null);
        localStorage.removeItem('auth_token');
        localStorage.removeItem('auth_customer');
    };

    return (
        <AuthContext.Provider
            value={{
                customer,
                token,
                isAuthenticated: !!token && !!customer,
                login,
                register,
                logout,
                isLoading,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
