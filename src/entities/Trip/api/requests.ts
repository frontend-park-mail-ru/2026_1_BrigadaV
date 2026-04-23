import { request } from '@/shared/api';

import { Trip } from '../model/types';
import { mapTrip } from './mappers';
import {
    CreateTripDTO, CreateTripRequest, CreateTripResponse, DeleteTripRequest, TripDTO,
    UpdateTripRequest
} from './types';

export const getUserTripList = async (): Promise<Trip[]> => {
    const dto = await request<TripDTO[]>('/trips', {
        method: 'GET',
    });

    if (!dto) return [];

    return dto.map(mapTrip);
};

export const createTrip = async (data: CreateTripRequest): Promise<CreateTripResponse> => {
    const dto = await request<CreateTripDTO>('/trips', {
        method: 'POST',
        body: JSON.stringify(data),
    });

    if (!dto) throw new Error('Couldn\'t create a new trip');

    return dto;
};

export const deleteTrip = async (data: DeleteTripRequest): Promise<any> => {
    return await request(`/trips/${data.id}`, {
        method: 'DELETE',
    });
};


export const updateTrip = async (data: UpdateTripRequest): Promise<any> => {
    return await request(`/trips/${data.id}`, {
        method: 'PUT',
        body: JSON.stringify({
            id: data.id,
            title: data.title,
            location: data.location,
            description: data.description,
            start_date: data.startDate,
            end_date: data.endDate,
        }),
    });
};


export const fetchTrip = async (tripId: number): Promise<Trip> => {
    const dto = await request<TripDTO>(`/trips/${tripId}`, {
        method: 'GET',
    });

    if (!dto) throw new Error('Couldn\'t fetch trip');

    return mapTrip(dto);
};
