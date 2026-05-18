export type SingleRatingItem = {
    id: number;
    name: string;
    threshold: number;
}

export type RatingAccordionProps = {
    title: string;
    items: SingleRatingItem[],
    activeIds?: number[];
}
