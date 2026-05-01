import { createReview } from '@/entities/Review/api';
import { Review } from '@/entities/Review/model/types';
import { UserAuth } from '@/entities/User';
import { eventBus } from '@/shared/lib';
import { Toast } from '@/shared/ui/Toast';
import { ReviewList } from '@/widgets/ReviewList';
import { WriteReviewDialog } from '@/widgets/WriteReviewDialog';
import { WriteReviewPayload } from '@/widgets/WriteReviewDialog/model/types';

export const handleReviewCreate = async ({ instance, data, reviewList, user, placeId }: { instance: WriteReviewDialog, data: WriteReviewPayload, reviewList: ReviewList, user: UserAuth, placeId: number }): Promise<void> => {
    try {
        const newReviewData = {
            id: placeId,
            title: data.title,
            content: data.content,
            rating: Number(data.rating),
            createdAt: new Date(),
        };

        const success = await createReview(newReviewData);

        if (success.message === 'ok') {
            const newReview: Review = {
                ...newReviewData,
                id: success.id,
                author: {
                    id: user.id,
                    nickname: user.nickname,
                    avatar: user.avatar,
                }
            };
            eventBus.emit('ReviewCreate:success', { type: 1, newReview });
        }
    } catch (error) {
        let toastMessage = 'Произошла непредвиденная ошибка. Пожалуйста, повторите попытку позже.';
        switch (error.error) {
        case 'rating must be between 1 and 5':
            toastMessage = 'Оценка должна быть от 1 до 5';
            break;
        }

        Toast({
            message: toastMessage,
            type: 'error',
        });
    }
};
