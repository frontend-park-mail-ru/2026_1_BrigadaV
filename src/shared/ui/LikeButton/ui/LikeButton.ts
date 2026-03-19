import './style.scss';

import { stringToElement } from '@/shared/utils';

import { LikeButtonProps } from '../model/types';
import template from './LikeButton.hbs?compiled';

export class LikeButton {
    private element: HTMLElement | null = null;

    constructor(private props: LikeButtonProps) {}

    private initListeners(): void {
        this.element?.addEventListener('click', this.handleClick);
    }

    private handleClick = (): void => {
        this.element?.classList.toggle('like--active');
    }

    public render(): HTMLElement {
        this.element = stringToElement(template(this.props));
        this.initListeners();
        return this.element;
    }
}
