
export type ReviewDetailsVM = {
    id: number;
    authorName: string;
    avatarUrl?: string;
    placeName: string;
    dateText: string;
    dateIso: string;
    rating: number;
    title: string;
    content: string;
    reviewCountText: string;
    isOwner: boolean;
}

export type ReviewDetailsModalProps = {
    modalId: string;
}

export type ReviewDetailsModalInitValues = {
    data: ReviewDetailsVM;
}

export type ReviewDetailsModalPayload = {
    id: number;
}
