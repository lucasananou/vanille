// Admin Collections API

import { api } from './client';
import type { Collection } from '../types';

export const adminCollectionsApi = {
    /**
     * Get all collections
     */
    getCollections: async (token: string) => {
        return api.get<Collection[]>('/store/collections', token);
    },
};
