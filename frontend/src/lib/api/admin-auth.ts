// Admin Authentication API

import { api } from './client';

export interface AdminLoginDto {
    email: string;
    password: string;
}

export interface AdminAuthResponse {
    access_token: string;
    admin: {
        id: string;
        email: string;
        role: string;
    };
}

export const adminAuthApi = {
    /**
     * Admin login
     */
    login: async (data: AdminLoginDto) => {
        return api.post<AdminAuthResponse>('/admin/auth/login', data);
    },

    /**
     * Get admin profile
     */
    getProfile: async (token: string) => {
        return api.get('/admin/auth/profile', token);
    },
};
