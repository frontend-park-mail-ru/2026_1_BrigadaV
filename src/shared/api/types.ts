export type CategoryDTO = {
    id: number;
    name: string;
    description: string;
};

export type LocalityDTO = {
    id: number;
    name: string;
    country: string;
    latitude: number;
    longitude: number;
};

export type PlacePhotoDTO = {
    id: number;
    place_id: number;
    file_path: string;
    is_main: boolean;
};

export type PlaceDTO = {
    id: number;
    name: string;
    description: string;
    price: number;
    is_liked: boolean;
    locality: LocalityDTO;
    category?: CategoryDTO;
    photos?: PlacePhotoDTO[];
    created_at: string;
};

export type LoginDTO = {
    user_id: number;
    login: string;
    nickname: string;
    avatar_url: string;
};

export type RegisterDTO = {
    id: number;
    login: string;
    nickname: string;
    avatar_url: string;
    created_at: string;
    message?: string;
};

export type ErrorDTO = {
    error: string;
    field?: string;
    message: string;
};
