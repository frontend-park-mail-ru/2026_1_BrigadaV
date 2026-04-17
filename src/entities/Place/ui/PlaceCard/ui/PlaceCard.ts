import './style.scss';

import { formatNumber, injectComponents, stringToElement } from '@/shared/utils';

import { PlaceCardProps } from '../model/types';
import template from './PlaceCard.hbs?compiled';
import { IComponent } from '@/shared/model';

export class PlaceCard {
    private element?: HTMLElement;
    private actionElement?: IComponent;

    constructor(private props: PlaceCardProps) {
        this.actionElement = props.actionComponent;
    }

    public render(): HTMLElement {
        this.element = stringToElement(template({ ...this.props, formattedPrice: formatNumber(this.props.place.price) }));
        injectComponents(this.element, {
            'action': this.actionElement,
        })

        return this.element;
    }
}
