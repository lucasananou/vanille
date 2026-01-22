
import { api } from './client';

export interface Review {
    id: string;
    productId: string;
    customerId: string;
    rating: number;
    title?: string;
    comment: string;
    status: 'PENDING' | 'APPROVED' | 'REJECTED';
    verifiedPurchase: boolean;
    helpfulCount: number;
    createdAt: string;
    customer?: {
        firstName: string;
        lastName: string;
    };
}

export interface ReviewStats {
    totalReviews: number;
    averageRating: number;
    ratingDistribution: { [key: number]: number };
}

export interface ReviewsResponse {
    reviews: Review[];
    stats: ReviewStats;
}

export const reviewsApi = {
    getProductReviews: async (slug: string): Promise<ReviewsResponse> => {
        return api.get<ReviewsResponse>(`/store/products/${slug}/reviews`);
    },

    submitReview: async (slug: string, data: { rating: number; title: string; comment: string }): Promise<Review> => {
        return api.post<Review>(`/store/products/${slug}/reviews`, data);
    },
};
