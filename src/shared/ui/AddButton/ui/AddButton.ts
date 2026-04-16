import './style.scss';

import { stringToElement } from '@/shared/utils';

import { AddButtonProps } from '../model/types';
import template from './AddButton.hbs?compiled';

export class AddButton {
    private element?: HTMLElement;

    constructor(private props: AddButtonProps) { }

    private initListeners(): void {
        this.element?.addEventListener('click', this.handleClick);
    }

    private handleClick = (): void => {
        if (this.props.isActive) {
            this.props.onRemove();
        } else {
            this.props.onAdd();
        }

        this.element?.classList.toggle('add--active');
        this.props.isActive = !this.props.isActive;
    };

    public render(): HTMLElement {
        this.element = stringToElement(template(this.props));
        this.initListeners();
        return this.element;
    }
}
