import { Trip } from '@/entities/Trip/model/types';

export type TripCardProps = {
    trip: Trip;
}

export type TripCardPayload = Omit<Trip, 'preview'>;
