import template from './RecommendedList.hbs?compiled';
import './style.scss';

import { PlaceCard } from '@/entities/PlaceCard';

export const RecommendedList = (props) => {
    const cards = props.map(place => PlaceCard(place));

    return template({ cards });
};
