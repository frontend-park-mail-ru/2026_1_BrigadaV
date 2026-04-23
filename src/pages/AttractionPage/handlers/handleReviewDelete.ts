import { deleteReview } from '@/entities/Review/api';
import { Toast } from '@/shared/ui/Toast';
import { ReviewDetailsModal } from '@/widgets/ReviewDetailsModal';
import { ReviewDetailsModalPayload } from '@/widgets/ReviewDetailsModal/model/types';
import { ReviewList } from '@/widgets/ReviewList';

export const handleReviewDelete = async ({ instance, data, reviewList }: { instance: ReviewDetailsModal, data: ReviewDetailsModalPayload, reviewList: ReviewList }): Promise<void> => {
    try {
        const error = await deleteReview(data);

        if (!error) {
            reviewList.removeItem(data.id);
            instance.close();
        }
    } catch {
        Toast({
            message: 'Произошла непредвиденная ошибка. Пожалуйста, повторите попытку позже.',
            type: 'error',
        });
    }
};
