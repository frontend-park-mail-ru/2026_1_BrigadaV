export type Place = {
    id: number;
    name: string;
    description?: string;
    location: string;
    country: string;
    price: number;
    image?: string;
    isLiked: boolean;
    rating?: number;
}

export type PlaceSummary = {
    id: number;
    name: string;
    description: string;
    rating: number;
    image: string;
}
