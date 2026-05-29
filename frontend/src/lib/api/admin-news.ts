import { api } from './client';
import type { AdminNewsArticle } from '@/lib/data/news-articles';

export type AdminNewsPayload = Omit<AdminNewsArticle, 'id' | 'createdAt' | 'updatedAt'>;

export const adminNewsApi = {
    getArticles: (token: string) => api.get<AdminNewsArticle[]>('/admin/news', token),
    getArticle: (id: string, token: string) => api.get<AdminNewsArticle>(`/admin/news/${id}`, token),
    createArticle: (data: AdminNewsPayload, token: string) => api.post<AdminNewsArticle>('/admin/news', data, token),
    updateArticle: (id: string, data: AdminNewsPayload, token: string) => api.patch<AdminNewsArticle>(`/admin/news/${id}`, data, token),
    deleteArticle: (id: string, token: string) => api.delete(`/admin/news/${id}`, token),
};
