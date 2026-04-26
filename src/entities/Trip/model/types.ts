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
