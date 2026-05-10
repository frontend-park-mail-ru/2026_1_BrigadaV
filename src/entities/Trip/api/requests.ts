import { request } from '@/shared/api';
import { ApiResponse } from '@/shared/api/types';

import { Trip } from '../model/types';
import { mapTrip } from './mappers';
import {
    CreateTripDTO,
    CreateTripRequest,
    CreateTripResponse,
    DeleteTripRequest,
    TripDTO,
    UpdateTripRequest
} from './types';

export const getUserTripList = async (): Promise<ApiResponse<Trip[]>> => {
    const res = await request<TripDTO[]>('/trips', {
        method: 'GET',
    });

    if (!res.ok) return res;

    return {
        ...res,
        data: (res.data || []).map(mapTrip)
    };
};

export const createTrip = async (data: CreateTripRequest): Promise<ApiResponse<CreateTripResponse>> => {
    return await request<CreateTripDTO>('/trips', {
        method: 'POST',
        body: JSON.stringify(data),
    });
};

export const deleteTrip = async (data: DeleteTripRequest): Promise<ApiResponse<void>> => {
    return await request<void>(`/trips/${data.id}`, {
        method: 'DELETE',
    });
};

export const updateTrip = async (data: UpdateTripRequest): Promise<ApiResponse<void>> => {
    return await request<void>(`/trips/${data.id}`, {
        method: 'PUT',
        body: JSON.stringify({
            ...data,
            start_date: data.startDate,
            end_date: data.endDate,
        }),
    });
};

export const fetchTrip = async (tripId: number): Promise<ApiResponse<Trip>> => {
    const res = await request<TripDTO>(`/trips/${tripId}`, {
        method: 'GET'
    });

    if (!res.ok) return res;

    return {
        ...res,
        data: mapTrip(res.data)
    };
};
