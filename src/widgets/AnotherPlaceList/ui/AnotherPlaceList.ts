import './style.scss';

import { mapPlace, PlaceCard } from '@/entities/Place';
import { AbstractList } from '@/shared/ui/AbstractList';

import { AnotherPlaceListProps } from '../model/types';
import { API } from '@/shared/api';
import { AddButton } from '@/shared/ui/AddButton';
import { eventBus } from '@/shared/lib';

export class AnotherPlaceList extends AbstractList<PlaceCard, AnotherPlaceListProps> {
    constructor(props: AnotherPlaceListProps) {
        super(props);
        this.element.classList.add('another-place-list');
    }

    protected async loadData(): Promise<PlaceCard[]> {
        try {
            const placesData = await API.getPlaces();
            const places = placesData.map(mapPlace).sort((a, b) => {
                const aAdded = this.props.addedPlaces.has(a.id) ? 1 : 0;
                const bAdded = this.props.addedPlaces.has(b.id) ? 1 : 0;
                return bAdded - aAdded;
            });

            return places.map(place => new PlaceCard({
                place,
                actionComponent: new AddButton({
                    isActive: this.props.addedPlaces.has(place.id),
                    onAdd: () => eventBus.emit('PlaceCard:add', { placeId: place.id }),
                    onRemove: () => eventBus.emit('PlaceCard:remove', {placeId: place.id})
                }),
            }))

        } catch (error) {
            console.error(error);
        }

        return [];
    }

    protected renderItem(item: PlaceCard): HTMLElement {
        const li = document.createElement('li');
        li.classList.add('another-place-list__item');
        li.appendChild(item.render());

        return li;
    }
}
