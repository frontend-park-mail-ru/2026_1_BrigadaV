import { WriteReviewDialog } from "@/widgets/WriteReviewDialog";
import { WriteReviewFromData } from "../model/types";
import { API } from "@/shared/api";
import { appState } from "@/shared/config";
import { Review } from "@/entities/Review/model/types";
import { Toast } from "@/shared/ui/Toast";

export const handleSubmit = async (instance: WriteReviewDialog, data: FormData, placeId: number, onSuccess: (review: Review) => void): Promise<void> => {
    const rawData = Object.fromEntries(data) as unknown as WriteReviewFromData;
    const user = appState.currentUser;

    if (!user) return;

    try {
        const newReviewData = {
            placeId,
            title: String(rawData.title),
            content: String(rawData.content),
            rating: Number(rawData.rating),
            createdAt: new Date(),
        };

        const success = await API.createReview(newReviewData);

        if (success.message === 'ok') {
            onSuccess({
                ...newReviewData,
                author: {
                    id: user.id,
                    nickname: user.nickname,
                    avatar: user.avatar,
                },
                id: success.id,
            })
            instance.close();
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
        })
    }
}
