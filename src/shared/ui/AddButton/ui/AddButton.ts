import './style.scss';

import { stringToElement } from '@/shared/utils';

import { AddButtonProps } from '../model/types';
import template from './AddButton.hbs?compiled';

export class AddButton {
    private element?: HTMLElement;

    constructor(private props: AddButtonProps) {}

    private initListeners(): void {
        this.element?.addEventListener('click', this.handleClick);
    }

    private handleClick = (): void => {
        this.props.onClick();
    };

    public render(): HTMLElement {
        this.element = stringToElement(template(this.props));
        this.initListeners();
        return this.element;
    }
}
