import { BaseComponent } from '@/shared/lib/component/BaseComponent';
import { stringToElement } from '@/shared/utils';

import styles from './style.module.scss';
import template from './PlaceSearchItem.hbs?compiled';
import { PlaceSearchItemProps } from '../model/types';
import { navigate } from '@/shared/router';

export class PlaceSearchItem extends BaseComponent {
    constructor(private props: PlaceSearchItemProps) { super(); }

    protected override initListeners(): void {
        super.initListeners();
        this.element?.addEventListener('click', this.handleClick);
    }

    private handleClick = () => {
        const selection = window.getSelection()?.toString();
        if (selection) return;



        const link = this.element?.dataset.href;
        console.log(link);
        if (link) navigate(link);
    }

    private applyHighlight(name: string, positions: Set<number>): string {
        let result = '';
        let isInsideHighlight = false;

        for (let i = 0; i < name.length; i++) {
            if (!isInsideHighlight && positions.has(i)) {
                result += '<mark>';
                isInsideHighlight = true;

            } else if (isInsideHighlight && !positions.has(i)) {
                result += '</mark>'
                isInsideHighlight = false;
            }

            result += name[i];
        }
        console.log(result);

        return result;
    }

    protected override _render(): HTMLElement {
        const { place, positions } = this.props;
        const element = stringToElement(template({ ...this.props, styles }));

        const nameElement = element.querySelector('.card__title');

        if (positions && nameElement) {
            nameElement.innerHTML = this.applyHighlight(place.name, positions);
        }

        return element;
    }
}
