import { PlaceDTO } from '@/shared/api';

import type { Place } from "../model/types";

export const mapPlace = (placeData: PlaceDTO): Place => {
    return {
        id: placeData.id,
        name: placeData.name,
        location: placeData.locality.name,
        country: placeData.locality.country,
        price: placeData.price / 100,
        image: placeData.photos?.[0]?.file_path,
        isLiked: placeData.is_liked,
    }
}
