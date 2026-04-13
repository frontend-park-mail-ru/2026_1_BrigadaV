import { API } from "@/shared/api";
import { ReviewDetailsModal } from "@/widgets/ReviewDetailsModal";

export const handleReviewDelete = async (instance: ReviewDetailsModal, reviewId: number, onSuccess: (reviewId: number) => void): Promise<void> => {
    try {
        const success = await API.deleteReview(reviewId);

        if (success) {
            onSuccess(reviewId);
            instance.close();
        }
    } catch {
    }
}
