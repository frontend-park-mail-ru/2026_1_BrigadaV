export type PlaceSummary = {
    id: number;
    name: string;
    description: string;
    image?: string;
    rating?: number;
    price: number;
    isLiked: boolean;
    reviewCount: number;
}

export type Place = PlaceSummary & {
    location: string;
    country: string;
}
