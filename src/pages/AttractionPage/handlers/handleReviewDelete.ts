import { API } from "@/shared/api";
import { ReviewDetailsModal } from "@/widgets/ReviewDetailsModal";

export const handleReviewDelete = async (instance: ReviewDetailsModal, reviewId: number, onSuccess: (reviewId: number) => void): Promise<void> => {
    try {
        console.log(reviewId);

        const error = await API.deleteReview(reviewId);

        if (!error) {
            onSuccess(reviewId);
            instance.close();
        }
    } catch {
    }
}
