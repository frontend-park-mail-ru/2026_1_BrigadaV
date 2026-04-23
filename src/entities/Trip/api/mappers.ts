import { mapPlaceSummary } from '@/entities/Place';

import { Trip } from '../model/types';
import { TripDTO } from './types';

export const mapTrip = (dto: TripDTO): Trip => ({
    id: dto.id,
    title: dto.title,
    location: dto.location,
    startDate: dto.startDate ? new Date(dto.startDate) : undefined,
    endDate: dto.endDate ? new Date(dto.endDate) : undefined,
    description: dto.description,
    preview: dto.preview,
    places: dto.attractions ? dto.attractions.map(mapPlaceSummary) : [],
});
