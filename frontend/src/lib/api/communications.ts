import { api } from './client';

export const communicationsApi = {
  sendContactMessage: async (data: { name: string; email: string; message: string }) => {
    return api.post<{ message: string }>('/store/communications/contact', data);
  },

  sendB2BLead: async (data: { company: string; email: string; need: string }) => {
    return api.post<{ message: string }>('/store/communications/b2b', data);
  },

  subscribeNewsletter: async (data: { email: string }) => {
    return api.post<{ message: string }>('/store/communications/newsletter', data);
  },
};
