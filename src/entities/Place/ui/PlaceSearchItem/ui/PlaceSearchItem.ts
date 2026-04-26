import { BaseComponent } from '@/shared/lib/component/BaseComponent';
import { stringToElement } from '@/shared/utils';

import styles from './style.module.scss';
import template from './PlaceSearchItem.hbs?compiled';
import { PlaceSearchItemProps } from '../model/types';

export class PlaceSearchItem extends BaseComponent {
    constructor(private props: PlaceSearchItemProps) { super(); }

    protected override _render(): HTMLElement {
        return stringToElement(template({
            ...this.props,
            styles
        }));
    }
}
