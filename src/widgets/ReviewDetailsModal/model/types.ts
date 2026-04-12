import { Review } from '@/entities/Review/model/types';
import { UserAuth } from '@/entities/User';

export type ReviewDetailsModalProps = {
    id: string;
    user: UserAuth | null;
}

export type ReviewDetailsModalInitValues = {
    review: Review;
    placeName: string;
    reviewCount: number;
}
