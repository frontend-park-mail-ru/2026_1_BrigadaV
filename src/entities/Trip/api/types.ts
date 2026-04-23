import { PlaceSummaryDTO } from '@/entities/Place';

import { Trip } from '../model/types';

export type CreateTripRequest = Pick<Trip, 'title' | 'location'> & {
    is_public: boolean;
};

export type CreateTripResponse = Pick<Trip, 'id' | 'preview'>

export type DeleteTripRequest = Pick<Trip, 'id'>;

export type DeleteTripResponse = {
    error?: string;
}

export type UpdateTripRequest = Partial<Omit<Trip, 'preview'>>;

export type TripDTO = {
    id: number;
    title: string;
    location: string;
    description?: string;
    startDate?: string;
    endDate?: string;
    preview?: string;
    attractions: PlaceSummaryDTO[],
};

export type CreateTripDTO = {
    id: number;
    preview: string;
};
