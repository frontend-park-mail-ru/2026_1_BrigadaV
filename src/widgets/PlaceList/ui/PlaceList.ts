import './style.scss';

import { stringToElement } from '@/shared/utils';

import { PlaceListProps } from '../model/types';
import template from './PlaceList.hbs?compiled';
import { PlacePlacard } from '@/entities/Place/ui/PlacePlacard';

export class PlaceList {
    element?: HTMLElement;

    constructor(private props: PlaceListProps) { }

    private async loadPlaces(): Promise<void> {
        // TODO add API call
        if (!this.element) return;

        this.element.appendChild((new PlacePlacard({
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
        })).render())

        this.element.appendChild((new PlacePlacard({
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
        })).render())
    }

    public render(): HTMLElement {
        this.element = stringToElement(template(this.props));
        this.loadPlaces();
        return this.element;
    }
}
