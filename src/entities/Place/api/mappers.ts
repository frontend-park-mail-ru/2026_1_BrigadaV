import { Place, PlaceSummary } from '../model/types';
import { PlaceBaseDTO, PlaceDTO, PlaceSummaryDTO } from './types';

const resolveImage = (dto: PlaceBaseDTO): string | undefined => {
    return dto.photo_url || dto.photos?.[0]?.file_path;
};

export const mapPlaceSummary = (dto: PlaceSummaryDTO): PlaceSummary => ({
    id: dto.id,
    name: dto.name,
    description: dto.description,
    image: resolveImage(dto),
    rating: dto.rating,
    price: dto.price / 100,
    isLiked: dto.is_liked,
    reviewCount: dto.reviewCount,
});

export const mapPlace = (dto: PlaceDTO): Place => ({
    ...mapPlaceSummary(dto),
    location: dto.locality.name,
    country: dto.locality.country,
});
