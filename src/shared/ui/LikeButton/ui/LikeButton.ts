import './style.scss';

import { BaseComponent } from '@/shared/lib/component/BaseComponent';
import { stringToElement } from '@/shared/utils';

import { LikeButtonProps } from '../model/types';
import template from './LikeButton.hbs?compiled';

export class LikeButton extends BaseComponent {
    constructor(private props: LikeButtonProps) { super(); }

    protected override initListeners() {
        super.initListeners();
        this.element?.addEventListener('click', this.handleClick);
    }

    private handleClick = (): void => {
        this.element?.classList.toggle('like--active');
    };

    public setLabel(label: string): void {
        if (!this.element) return;
        this.element.textContent = label;
    }

    protected override _render(): HTMLElement {
        return stringToElement(template(this.props));
    }
}
