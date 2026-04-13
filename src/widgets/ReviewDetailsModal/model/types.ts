import { Review } from '@/entities/Review/model/types';
import { UserAuth } from '@/entities/User';
import { ReviewDetailsModal } from '../ui/ReviewDetailsModal';

export type ReviewDetailsModalProps = {
    id: string;
    user: UserAuth | null;
    onDelete: (instance: ReviewDetailsModal, reviewId: number) => Promise<void>;
}

export type ReviewDetailsModalInitValues = {
    review: Review;
    placeName: string;
    reviewCount: number;
}
