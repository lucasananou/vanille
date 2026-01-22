// Admin Dashboard API

import { api } from './client';

export interface DashboardOverview {
    totalRevenue: number;
    totalOrders: number;
    totalCustomers: number;
    totalProducts: number;
    revenueChange: number;
    ordersChange: number;
    customersChange: number;
}

export interface RevenueData {
    date: string;
    revenue: number;
}

export interface TopProduct {
    id: string;
    title: string;
    totalSold: number;
    revenue: number;
}

export const adminDashboardApi = {
    /**
     * Get dashboard overview
     */
    getOverview: async (token: string) => {
        return api.get<DashboardOverview>('/admin/dashboard/overview', token);
    },

    /**
     * Get revenue over time
     */
    getRevenue: async (token: string, days = 30) => {
        return api.get<RevenueData[]>(`/admin/dashboard/revenue?days=${days}`, token);
    },

    /**
     * Get recent orders
     */
    getRecentOrders: async (token: string, limit = 10) => {
        return api.get(`/admin/dashboard/recent-orders?limit=${limit}`, token);
    },

    /**
     * Get top selling products
     */
    getTopProducts: async (token: string, limit = 5) => {
        return api.get<TopProduct[]>(`/admin/dashboard/top-products?limit=${limit}`, token);
    },
};
