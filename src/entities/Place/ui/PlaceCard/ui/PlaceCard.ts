import './style.scss';

import { BaseComponent } from '@/shared/lib/component/BaseComponent';
import { IComponent } from '@/shared/model';
import { formatNumber, stringToElement } from '@/shared/utils';

import { PlaceCardProps } from '../model/types';
import template from './PlaceCard.hbs?compiled';

export class PlaceCard extends BaseComponent {
    declare children: {
        action?: IComponent;
    };

    private get place() {
        return this.props.place;
    }

    constructor(private props: PlaceCardProps) {
        super();
        this.children = {
            ...(props.action && { action: props.action }),
        };
    }

    private formatPrice() {
        return this.place.price === 0 ? 'Бесплатно' : `от ${formatNumber(this.place.price)} ₽`;
    }

    protected override _render(): HTMLElement {
        return stringToElement(template({
            ...this.props,
            formattedPrice: this.formatPrice(),
        }));
    }
}
