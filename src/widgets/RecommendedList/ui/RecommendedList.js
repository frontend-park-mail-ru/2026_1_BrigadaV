import template from './RecommendedList.hbs?compiled';
import './style.scss';

import { PlaceCard } from '@/entities/PlaceCard';
import { LikeButton } from '@/features/LikeButton/ui/LikeButton';
import { API } from '@/shared/api/api.js';
import { stringToElement } from '@/shared/utils';

export class RecommendedList {
    constructor(props) {
        this.props = props;

        this.element = stringToElement(template());
        this.listContainer = this.element.querySelector('[data-slot="list-container"]');

        this.loadPlaces();
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
            }));

            cleanedPlaces.forEach(place => {
                const likeButton = new LikeButton({
                    isLiked: place.isLiked,
                    className: "card__like"
                });

                const card = new PlaceCard(place);

                const likeSlot = card.render().querySelector('[data-slot="like-button"]');
                if (likeSlot && authorized) {
                    likeSlot.replaceWith(likeButton.render());
                }

                const li = document.createElement('li');
                li.className = 'recommended__item';
                li.appendChild(card.render());

                this.listContainer.appendChild(li);
            });

        } catch (error) {
            console.error('Failed to load recommended places:', error);
        }
    }

    render() {
        return this.element;
    }
}
