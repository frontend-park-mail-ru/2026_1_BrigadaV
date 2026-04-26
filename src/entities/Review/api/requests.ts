import { request } from '@/shared/api';

import { Review } from '../model/types';
import { mapReview } from './mappers';
import { CreateReviewRequest, DeleteReviewRequest, ReviewDTO } from './types';

export const fetchPlaceReviews = async (placeId: number): Promise<Review[]> => {
    const dto = await request<ReviewDTO[]>(`/places/${placeId}/reviews`, {
        method: 'GET'
    });

    if (!dto) return [];

    return dto.map(mapReview);
};

export const deleteReview = async (data: DeleteReviewRequest) => {
    return await request(`/reviews/${data.id}`, {
        method: 'DELETE',
    });
};

export const createReview = async (data: CreateReviewRequest) => {
    return await request('/reviews', {
        method: 'POST',
        body: JSON.stringify({
            ...data,
            place_id: data.id,
            visit_date: data.createdAt
        }),
    });
};
