import { mapPlaceSummary } from '@/entities/Place';

import defaultPreview from '../assets/trip-preview.jpg';
import { Trip } from '../model/types';
import { TripDTO } from './types';

export const mapTrip = (dto: TripDTO): Trip => ({
    ...dto,
    startDate: dto.startDate ? new Date(dto.startDate) : undefined,
    endDate: dto.endDate ? new Date(dto.endDate) : undefined,
    places: dto.attractions ? dto.attractions.map(mapPlaceSummary) : [],
    preview: dto.preview || defaultPreview,
});
