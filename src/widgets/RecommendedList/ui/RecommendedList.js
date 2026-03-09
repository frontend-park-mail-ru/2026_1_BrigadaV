import template from './RecommendedList.hbs?compiled';
import './style.scss';

import { PlaceCard } from '@/entities/PlaceCard';
import { API } from '@/shared/api/api.js';

export const RecommendedList = async (props) => {
    const placesData = await API.getPlaces();

    const cleanedPlaces = placesData.map(place => ({
        id: place.id,
        name: place.name,
        location: `${place.locality.name}, ${place.locality.country}`,
        price: place.price / 100,
        image: place.photos?.[0]?.file_path,
        isLiked: props.user?.liked_ids?.includes(place.id)
    }));

    const cards = cleanedPlaces.map(place => PlaceCard(place));

    return template({ cards });
};
