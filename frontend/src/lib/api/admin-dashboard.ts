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
    averageOrderValue?: number;
    conversionRate?: number;
    googleAnalytics?: {
        configured: boolean;
        propertyId?: string;
        activeUsers: number;
        sessions: number;
        pageViews: number;
        averageSessionDuration: number;
        bounceRate: number;
        periodLabel: string;
        error?: string;
    };
    orders?: {
        total: number;
        pending: number;
        paid: number;
        shipped: number;
    };
}

export interface GoogleAnalyticsSummary {
    configured: boolean;
    propertyId?: string;
    activeUsers: number;
    sessions: number;
    pageViews: number;
    averageSessionDuration: number;
    bounceRate: number;
    periodLabel: string;
    error?: string;
}

export interface GoogleAnalyticsDashboard {
    configured: boolean;
    propertyId?: string;
    periodLabel: string;
    summary: GoogleAnalyticsSummary;
    timeseries: Array<{
        date: string;
        activeUsers: number;
        sessions: number;
        pageViews: number;
    }>;
    channels: Array<{
        label: string;
        value: number;
        secondaryValue?: number;
    }>;
    topPages: Array<{
        label: string;
        value: number;
        secondaryValue?: number;
    }>;
    countries: Array<{
        label: string;
        value: number;
    }>;
    devices: Array<{
        label: string;
        value: number;
    }>;
    events: Array<{
        eventName: string;
        eventCount: number;
        users: number;
    }>;
    error?: string;
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

    getAnalytics: async (token: string) => {
        return api.get<GoogleAnalyticsDashboard>('/admin/dashboard/analytics', token);
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
