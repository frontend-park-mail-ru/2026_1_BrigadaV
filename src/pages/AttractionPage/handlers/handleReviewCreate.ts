import { createReview } from '@/entities/Review/api';
import { Review } from '@/entities/Review/model/types';
import { UserAuth } from '@/entities/User';
import { eventBus } from '@/shared/lib';
import { Toast } from '@/shared/ui/Toast';
import { WriteReviewPayload } from '@/widgets/WriteReviewDialog/model/types';

export const handleReviewCreate = async ({ data, user, placeId }: { data: WriteReviewPayload, user: UserAuth, placeId: number }): Promise<void> => {
    const newReviewData = {
        id: placeId,
        title: data.title,
        content: data.content,
        rating: Number(data.rating),
        createdAt: new Date(),
    };

    const createRes = await createReview(newReviewData);
    if (createRes.ok) {
        const newReview: Review = {
            ...newReviewData,
            id: createRes.data.id,
            author: {
                id: user.id,
                nickname: user.nickname,
                avatar: user.avatar,
            }
        };

        eventBus.emit('ReviewCreate:success', { type: 1, newReview });
    } else {
        let toastMessage = 'Произошла непредвиденная ошибка. Пожалуйста, повторите попытку позже.';
        switch (createRes.error) {
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
