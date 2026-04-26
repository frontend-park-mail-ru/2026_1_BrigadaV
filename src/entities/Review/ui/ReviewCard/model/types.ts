import { Review } from '@/entities/Review/model/types';

export type ReviewCardProps = {
    review: Review;
}

export type ReviewCardPayload = ReviewCardProps['review'];
