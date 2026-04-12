import { ReviewDTO } from '@/shared/api';

import { Review } from '../model/types';

export const mapReview = (reviewData: ReviewDTO): Review => {
    return {
        id: reviewData.id,
        author: reviewData.author,
        title: reviewData.title,
        rating: reviewData.rating,
        content: reviewData.comment,
        createdAt: new Date(reviewData.created_at),
    }
}
