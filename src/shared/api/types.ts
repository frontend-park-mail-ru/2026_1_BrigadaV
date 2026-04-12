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
    rating?: number;
};

export type PlaceSummaryDTO = {
    id: number;
    name: string;
    description: string;
    rating: number;
    image: string;
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

export type ReviewDTO = {
    id: number;
    author: UserSummaryDTO;
    place_id: number;
    rating: number;
    title: string;
    comment?: string;
    visit_date?: string;
    created_at: string;
    updated_at: string;
};

export type UserDTO = {
    id: number;
    nickname: string;
    avatar?: string;
    location: LocalityDTO;
    about?: string;
    comment_count: number;
    created_at: string;
    updated_at: string;
}

export type UserSummaryDTO = {
    id: number;
    nickname: string;
    avatar?: string,
}

export type TripDTO = {
    id: number;
    title: string;
    description?: string;
    location: LocalityDTO;
    start_date?: string;
    end_date?: string;
    created_by: number;
    is_public: boolean;
    created_at: string;
    updated_at: string;
    preview: string;
};

export type TripSummaryDTO = {
    id: number;
    title: string;
    location: string;
    start_date?: Date;
    end_date?: Date;
    preview: string;
};

export type ErrorDTO = {
    error: string;
    field?: string;
    message: string;
};
