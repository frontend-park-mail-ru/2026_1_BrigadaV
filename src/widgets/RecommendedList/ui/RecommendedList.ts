import './style.scss';

import { PlaceCard } from '@/entities/Place';
import { mapPlace } from '@/entities/Place';
import { API } from '@/shared/api';
import { stringToElement } from '@/shared/utils';

import { RecommendedListProps } from '../model/types';
import template from './RecommendedList.hbs?compiled';

export class RecommendedList {
    private element?: HTMLElement;
    private listContainer: HTMLElement | null = null;

    constructor(private props: RecommendedListProps) {}

    private async loadPlaces(): Promise<void> {
        try {
            const placesData = await API.getPlaces();
            const authorized = this.props.user !== null;

            const places = placesData.map(mapPlace);

            places.forEach(place => {
                const card = new PlaceCard({
                    ...place,
                    authorized
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
