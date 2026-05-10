import { deleteReview } from '@/entities/Review/api';
import { ReviewCardPayload } from '@/entities/Review/ui/ReviewCard/model/types';
import { eventBus } from '@/shared/lib';
import { Toast } from '@/shared/ui/Toast';

export const handleReviewDelete = async ({ data }: { data: ReviewCardPayload }): Promise<void> => {
    const deleteRes = await deleteReview(data);

    if (deleteRes.ok) {
        eventBus.emit('ReviewDelete:success', { type: -1, reviewId: data.id });
    } else {
        Toast({
            message: 'Произошла непредвиденная ошибка. Пожалуйста, повторите попытку позже.',
            type: 'error',
        });
    }
};
