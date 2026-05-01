import { BaseComponent } from '@/shared/lib/component/BaseComponent';
import { stringToElement } from '@/shared/utils';

import { PlacePlacardProps } from '../model/types';
import template from './PlacePlacard.hbs?compiled';
import styles from './style.module.scss';
import { navigate } from '@/shared/router';

export class PlacePlacard extends BaseComponent {
    constructor(private props: PlacePlacardProps) { super(); }

    private get place() {
        return this.props.place;
    }

    protected override initListeners(): void {
        super.initListeners();
        this.element?.addEventListener('click', this.handleClick);
    }

    private handleClick = () => {
        const selection = window.getSelection()?.toString();

        if (selection) return;

        const link = this.fields.link;
        if (link instanceof HTMLAnchorElement) navigate(link.href);
    };

    protected override _render(): HTMLElement {
        const element = stringToElement(template({
            ...this.props,
            styles,
        }));
        element.style.setProperty('--rating', this.place.rating.toString());
        return element;
    }
}
