import { PlaceSummary } from '@/entities/Place/model/types';

export type Trip = {
    id: number;
    title: string;
    description?: string;
    location: string;
    startDate?: Date;
    endDate?: Date;
    preview?: string;
    places: PlaceSummary[];
}

export type Album = {
    ID: number;
    TripID: number;
    Name: string;
    Description: string;
    CoverPhotoID?: number;
    MaxPhotos: number;
    CreatedAt: string;
    UpdatedAt: string;
}

export type AlbumPhoto = {
    id: number;
    url: string;
}