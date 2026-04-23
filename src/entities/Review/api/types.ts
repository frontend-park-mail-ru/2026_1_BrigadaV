import { UserSummaryDTO } from '@/entities/User';

import { Review } from '../model/types';

export type ReviewDTO = {
    id: number;
    author: UserSummaryDTO;
    place_id: number;
    rating: number;
    title?: string;
    content: string;
    visit_date?: string;
    createdAt: string;
    updated_at: string;
};

export type DeleteReviewRequest = {
    id: number;
}

export type CreateReviewRequest = Omit<Review, 'author'>;
