// Admin Authentication API

import { api } from './client';

export interface AdminLoginDto {
    email: string;
    password: string;
}

export interface AdminAuthResponse {
    accessToken?: string;
    access_token?: string;
    refreshToken?: string;
    admin: {
        id: string;
        email: string;
        role: string;
    };
}

export interface ChangeAdminPasswordDto {
    currentPassword: string;
    newPassword: string;
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

    /**
     * Change current admin password
     */
    changePassword: async (data: ChangeAdminPasswordDto, token: string) => {
        return api.patch<{ message: string }>('/admin/auth/password', data, token);
    },
};
