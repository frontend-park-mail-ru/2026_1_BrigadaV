import { Place } from '@/entities/Place/model/types';
import { stringToElement } from '@/shared/utils';

import { PlacePlacardProps } from '../model/types';
import template from './PlacePlacard.hbs?compiled';
import styles from './style.module.scss';

export class PlacePlacard {
    element?: HTMLElement;

    constructor(private props: PlacePlacardProps) { }

    private get place(): Place {
        return this.props.place;
    }

    public render(): HTMLElement {
        console.log(this.place);
        
        this.element = stringToElement(template({
            ...this.props,
            styles,
        }));
        this.element.style.setProperty('--rating', this.place.rating.toString());

        return this.element;
    }
}
