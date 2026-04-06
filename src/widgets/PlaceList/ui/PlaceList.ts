import './style.scss';

import { PlacePlacard } from '@/entities/Place/ui/PlacePlacard';
import { AbstractList } from '@/shared/ui/AbstractList';

import { PlaceListProps } from '../model/types';

export class PlaceList extends AbstractList<PlacePlacard, PlaceListProps> {
    constructor(props: PlaceListProps) {
        super(props);
        this.element.classList.add('place-list');
    }

    protected async loadData(): Promise<PlacePlacard[]> {
        return [
            new PlacePlacard({
                place: {
                    id: 1,
                    name: 'Британский музей',
                    description: 'Музей искусств',
                    location: '',
                    country: '',
                    price: 0,
                    image: '/mock/place/place1.png',
                    isLiked: false,
                    rating: 4.6,
                }
            }),
            new PlacePlacard({
                place: {
                    id: 13,
                    name: 'Букингемский дворец',
                    description: 'Культурные достопримечательности',
                    location: '',
                    country: '',
                    price: 0,
                    image: '/mock/place/place2.png',
                    isLiked: false,
                    rating: 0.8,
                }
            })
        ];
    }

    protected renderItem(item: PlacePlacard): HTMLElement {
        const li = document.createElement('li');
        li.classList.add('place-list__item');
        li.appendChild(item.render());

        return li;
    }
}
