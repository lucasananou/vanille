// Authentication API functions

import { api } from './client';

export interface RegisterDto {
    email: string;
    password: string;
    firstName?: string;
    lastName?: string;
    phone?: string;
}

export interface LoginDto {
    email: string;
    password: string;
}

export interface AuthResponse {
    access_token: string;
    customer: {
        id: string;
        email: string;
        firstName?: string;
        lastName?: string;
    };
}

export const authApi = {
    /**
     * Register new customer
     */
    register: async (data: RegisterDto) => {
        return api.post<AuthResponse>('/auth/customer/register', data);
    },

    /**
     * Login customer
     */
    login: async (data: LoginDto) => {
        return api.post<AuthResponse>('/auth/customer/login', data);
    },

    /**
     * Get current customer profile
     */
    getProfile: async (token: string) => {
        return api.get('/customer/profile', token);
    },
};
