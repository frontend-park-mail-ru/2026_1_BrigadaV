import { deleteReview } from '@/entities/Review/api';
import { ReviewCardPayload } from '@/entities/Review/ui/ReviewCard/model/types';
import { eventBus } from '@/shared/lib';
import { Toast } from '@/shared/ui/Toast';
import { ReviewDetailsModal } from '@/widgets/ReviewDetailsModal';
import { ReviewDetailsModalPayload } from '@/widgets/ReviewDetailsModal/model/types';
import { ReviewList } from '@/widgets/ReviewList';

export const handleReviewDelete = async ({ data }: { data: ReviewCardPayload }): Promise<void> => {
    try {
        const error = await deleteReview(data);

        if (!error) {
            eventBus.emit('ReviewDelete:success', { type: -1, reviewId: data.id });
        }
    } catch {
        Toast({
            message: 'Произошла непредвиденная ошибка. Пожалуйста, повторите попытку позже.',
            type: 'error',
        });
    }
};
