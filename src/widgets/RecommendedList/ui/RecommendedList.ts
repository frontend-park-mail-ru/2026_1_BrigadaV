import './style.scss';

import { mapPlace, PlaceCard } from '@/entities/Place';
import { API } from '@/shared/api';
import { stringToElement } from '@/shared/utils';

import { RecommendedListProps } from '../model/types';
import template from './RecommendedList.hbs?compiled';
import { LikeButton } from '@/shared/ui';

export class RecommendedList {
    private element?: HTMLElement;
    private listContainer: HTMLElement | null = null;

    constructor(private props: RecommendedListProps) { }

    private getRandom(array: unknown[], amount: number) {
        if (array.length <= amount) return array;

        const result = [];

        for (let i = 0; i < amount; i++) {
            result.push(array[Math.floor(Math.random() * array.length)]);
        }

        return result;
    }

    private async loadPlaces(): Promise<void> {
        try {
            const placesData = await API.getPlaces();
            const authorized = this.props.user !== null;

            const places = placesData.map(this.getRandom(mapPlace, 8));

            places.forEach(place => {
                const card = new PlaceCard({
                    place,
                    authorized,
                    ...(authorized && {
                        actionComponent: new LikeButton({ isLiked: place.isLiked })
                    })
                });

                const li = document.createElement('li');
                li.className = 'recommended__item';
                li.appendChild(card.render());

                // TODO Сразу создавать listContainer с анимацией загрузки
                this.listContainer?.appendChild(li);
            });

        } catch {
            // TODO Добавить empty state для карточек
        }
    }

    public render(): HTMLElement {
        this.element = stringToElement(template());
        this.listContainer = this.element.querySelector('[data-slot="list-container"]');

        if (this.listContainer) {
            this.loadPlaces();
        }

        return this.element;
    }
}
