import { request } from '@/shared/api';

import { Place, PlaceSummary } from '../model/types';
import { mapPlace, mapPlaceSummary } from './mappers';
import { PlaceDTO } from './types';

export const getPlaces = async (): Promise<Place[]> => {
    const dto = await request<PlaceDTO[]>('/places', {
        method: 'GET',
    });

    if (!dto) return [];

    return dto.map(mapPlace);
};

export const fetchPlace = async (placeId: number): Promise<PlaceSummary> => {
    const dto = await request<PlaceDTO>(`/places/${placeId}`, {
        method: 'GET',
    });

    if (!dto) throw new Error('Couldn\'t fetch place');

    return mapPlaceSummary(dto);
};

export const fetchAddedPlaces = async (tripId: number): Promise<number[]> => {
    const placeIds = await request<number[]>(`/trips/${tripId}/places`, {
        method: 'GET',
    });

    return placeIds || [];
};

export const addTripPlace = async (tripId: number, placeId: number, orderIndex: number) => {
    return request(`/trips/${tripId}/places`, {
        method: 'POST',
        body: JSON.stringify({ place_id: placeId, order_index: orderIndex }),
    });
};

export const deleteTripPlace = async (tripId: number, placeId: number) => {
    return request(`/trips/${tripId}/places/${placeId}`, {
        method: 'DELETE',
    });
};
