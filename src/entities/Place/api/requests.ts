import { request } from '@/shared/api';
import { ApiResponse } from '@/shared/api/types';
import { Place, PlaceSummary } from '../model/types';
import { mapPlace, mapPlaceSummary } from './mappers';
import { PlaceDTO } from './types';

export const fetchPlaces = async (): Promise<ApiResponse<Place[]>> => {
    const res = await request<PlaceDTO[]>('/places', {
        method: 'GET',
    });

    if (!res.ok) return res;

    return {
        ...res,
        data: res.data.map(mapPlace)
    };
};

export const fetchPlace = async (placeId: number): Promise<ApiResponse<PlaceSummary>> => {
    const res = await request<PlaceDTO>(`/places/${placeId}`, {
        method: 'GET',
    });

    if (!res.ok) return res;

    return {
        ...res,
        data: mapPlaceSummary(res.data)
    };
};

export const fetchAddedPlaces = async (tripId: number): Promise<ApiResponse<number[]>> => {
    const res = await request<number[]>(`/trips/${tripId}/places`, {
        method: 'GET',
    });

    if (!res.ok) return res;

    return {
        ...res,
        data: res.data || []
    };
};

export const addTripPlace = async (
    tripId: number,
    placeId: number,
    orderIndex: number
): Promise<ApiResponse<void>> => {
    return await request<void>(`/trips/${tripId}/places`, {
        method: 'POST',
        body: JSON.stringify({
            place_id: placeId,
            order_index: orderIndex
        }),
    });
};

export const deleteTripPlace = async (
    tripId: number,
    placeId: number
): Promise<ApiResponse<void>> => {
    return await request<void>(`/trips/${tripId}/places/${placeId}`, {
        method: 'DELETE',
    });
};

export const searchPlace = async (query: string): Promise<ApiResponse<Place[]>> => {
    const res = await request<PlaceDTO[]>(`/places/search?q=${encodeURIComponent(query)}`, {
        method: 'GET',
    });

    if (!res.ok) return res;

    return {
        ...res,
        data: res.data.map(mapPlace)
    };
};
