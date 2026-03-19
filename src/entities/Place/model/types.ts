export type Place = {
    id: number
    name: string;
    location: string;
    country: string;
    price: number;
    image?: string;
    isLiked: boolean;
}

export type PlaceCardProps = Place & {
    authorized: boolean;
}
