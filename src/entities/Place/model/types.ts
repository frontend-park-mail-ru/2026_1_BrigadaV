import { CategorySummary } from "@/entities/Category/model/types";

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
    category: CategorySummary;
    location: string;
    country: string;
}
