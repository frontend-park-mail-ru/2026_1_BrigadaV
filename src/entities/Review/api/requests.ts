import { request } from '@/shared/api';
import { ApiResponse } from '@/shared/api/types';
import { Review } from '../model/types';
import { mapReview } from './mappers';
import { CreateReviewRequest, CreateReviewResponse, DeleteReviewRequest, ReviewDTO } from './types';

export const fetchPlaceReviews = async (placeId: number): Promise<ApiResponse<Review[]>> => {
    const res = await request<ReviewDTO[]>(`/places/${placeId}/reviews`, {
        method: 'GET'
    });

    if (!res.ok) return res;

    return {
        ...res,
        data: (res.data || []).map(mapReview)
    };
};

export const deleteReview = async (data: DeleteReviewRequest): Promise<ApiResponse<void>> => {
    return await request<void>(`/reviews/${data.id}`, {
        method: 'DELETE',
    });
};

export const createReview = async (data: CreateReviewRequest): Promise<ApiResponse<CreateReviewResponse>> => {
    return await request<CreateReviewResponse>('/reviews', {
        method: 'POST',
        body: JSON.stringify({
            ...data,
            place_id: data.id,
            visit_date: data.createdAt
        }),
    });
};
