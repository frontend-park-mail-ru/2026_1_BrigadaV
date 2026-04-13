import { WriteReviewDialog } from "@/widgets/WriteReviewDialog";
import { WriteReviewFromData } from "../model/types";
import { API } from "@/shared/api";
import { appState } from "@/shared/config";
import { Review } from "@/entities/Review/model/types";

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
                id: 12,
            })
            instance.close();
        }
    } catch {
    }
}
