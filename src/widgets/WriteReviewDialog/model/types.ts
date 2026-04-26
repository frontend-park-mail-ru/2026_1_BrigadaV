import { PlaceSummary } from '@/entities/Place/model/types';

export type WriteReviewDialogProps = {
    id: string;
    place: PlaceSummary;
}

export type WriteReviewFields = {
    [K in 'title' | 'rating' | 'content' ]: string;
};

export type WriteReviewPayload = WriteReviewFields;

