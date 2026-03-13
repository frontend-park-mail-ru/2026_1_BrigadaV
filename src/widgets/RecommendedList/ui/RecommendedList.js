import template from './RecommendedList.hbs?compiled';
import './style.scss';

import { PlaceCard } from '@/entities/PlaceCard';
import { API } from '@/shared/api/api.js';
import { stringToElement } from '@/shared/utils';

export class RecommendedList {
    constructor(props) {
        this.props = props;
    }

    async loadPlaces() {
        try {
            const placesData = await API.getPlaces();
            const authorized = this.props.user !== null;

            const cleanedPlaces = placesData.map(place => ({
                id: place.id,
                name: place.name,
                location: `${place.locality.name}, ${place.locality.country}`,
                price: place.price / 100,
                image: place.photos?.[0]?.file_path,
                isLiked: this.props.user?.liked_ids?.includes(place.id),
                authorized: authorized,
            }));

            cleanedPlaces.forEach(place => {
                const card = new PlaceCard(place);

                const li = document.createElement('li');
                li.className = 'recommended__item';
                li.appendChild(card.render());

                this.listContainer.appendChild(li);
            });

        } catch {
            // TODO Добавить empty state для карточек
        }
    }

    render() {
        this.element = stringToElement(template());
        this.listContainer = this.element.querySelector('[data-slot="list-container"]');

        this.loadPlaces();

        return this.element;
    }
}
