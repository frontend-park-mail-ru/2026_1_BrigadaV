import { API } from "@/shared/api";
import { Toast } from "@/shared/ui/Toast";
import { ReviewDetailsModal } from "@/widgets/ReviewDetailsModal";

export const handleReviewDelete = async (instance: ReviewDetailsModal, reviewId: number, onSuccess: (reviewId: number) => void): Promise<void> => {
    try {
        const error = await API.deleteReview(reviewId);

        if (!error) {
            onSuccess(reviewId);
            instance.close();
        }
    } catch {
        Toast({
            message: 'Произошла непредвиденная ошибка. Пожалуйста, повторите попытку позже.',
            type: 'error',
        })
    }
}
