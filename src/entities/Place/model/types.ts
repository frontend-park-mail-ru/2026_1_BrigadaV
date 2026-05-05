export type PlaceSummary = {
    id: number;
    name: string;
    description: string;
    image?: string;
    rating?: number;
    price: number;
    isLiked: boolean;
    reviewCount: number;

    lat?: number;
    lon?: number;
}

export type Place = PlaceSummary & {
    categoryId: number;
    location: string;
    country: string;
}
