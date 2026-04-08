import { Review } from "@/entities/Review/model/types";
import { User } from "@/entities/User";

export type ReviewDetailsModalProps = {
    id: string;
    user: User | null;
}

export type ReviewDetailsModalInitValues = {
    review: Review;
    placeName: string;
    reviewCount: number;
}
