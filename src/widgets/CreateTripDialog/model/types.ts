import { Trip } from '@/entities/Trip/model/types';

export type CreateTripDialogProps = {
    id: string;
}

export type CreateTripDialogFields = Pick<Trip, 'title' | 'location'>;
export type CreateTripDialogPayload = CreateTripDialogFields;
