import './style.scss';

import { PlacePlacard } from '@/entities/Place/ui/PlacePlacard';
import { AbstractList } from '@/shared/ui/AbstractList';

import { PlaceListProps } from '../model/types';
import { API } from '@/shared/api';
import { mapPlaceSummary } from '@/entities/Place';

export class PlaceList extends AbstractList<PlacePlacard, PlaceListProps> {
    constructor(props: PlaceListProps) {
        super(props);
        this.element.classList.add('place-list');
    }

    protected async loadData(): Promise<PlacePlacard[]> {
        try {
            return this.props.places || [];

        } catch (error) {
            console.error(error);
        }

        return [];
    }

    protected renderItem(item: PlacePlacard): HTMLElement {
        const li = document.createElement('li');
        li.classList.add('place-list__item');
        li.appendChild(item.render());

        return li;
    }
}
