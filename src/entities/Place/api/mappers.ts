import { Place, PlaceSummary } from '../model/types';
import { PlaceBaseDTO, PlaceDTO, PlaceSummaryDTO } from './types';

const resolveImage = (dto: PlaceBaseDTO): string | undefined => {
    return dto.photo_url || dto.photos?.[0]?.file_path;
};

export const mapPlaceSummary = (dto: PlaceSummaryDTO): PlaceSummary => ({
    ...dto,
    reviewCount: dto.reviewCount || 0,
    rating: Number(dto.rating?.toFixed(2)),
    image: resolveImage(dto),
    price: dto.price / 100,
    isLiked: dto.is_liked,

    lat: dto.latitude,
    lon: dto.longitude,
});

export const mapPlace = (dto: PlaceDTO): Place => ({
    ...mapPlaceSummary(dto),
    location: dto.locality.name,
    country: dto.locality.country,
});
