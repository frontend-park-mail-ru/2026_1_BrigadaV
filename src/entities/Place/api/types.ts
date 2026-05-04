export type CategoryDTO = {
    id: number;
    name: string;
    description: string;
};

export type LocalityDTO = {
    id: number;
    name: string;
    country: string;
    Latitude: number;
    Longitude: number;
};

export type PlacePhotoDTO = {
    id: number;
    place_id: number;
    file_path: string;
    is_main: boolean;
};

export type BasePlaceDTO = {
    id: number;
    name: string;
    description?: string;
    image?: string;
}

export type PlaceBaseDTO = {
    id: number;
    name: string;
    description: string;
    photo_url?: string;
    photos?: PlacePhotoDTO[];
    rating?: number;
    is_liked: boolean;
    price: number;
    latitude?: number;
    longitude?: number; 
};

export type PlaceSummaryDTO = PlaceBaseDTO & {
    reviewCount?: number;
};

export type PlaceDTO = PlaceBaseDTO & {
    locality: LocalityDTO;
    category?: CategoryDTO;
    created_at: string;
};
