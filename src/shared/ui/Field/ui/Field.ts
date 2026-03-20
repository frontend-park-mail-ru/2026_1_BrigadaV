import './style.scss';

import { stringToElement } from '@/shared/utils';

import { FieldProps } from '../model/types';
import template from './Field.hbs?compiled';

export class Field {
    private element?: HTMLElement;

    constructor(private props: FieldProps) { }

    private initListeners(): void {
        const button = this.element?.querySelector('.field__icon');

        if (button && this.props.iconPath && this.props.onIconClick) {
            button.addEventListener('click', this.handleIconClick)
        }
    }

    private handleIconClick = (event: Event): void => {
        const button = event.currentTarget;

        if (button instanceof HTMLElement && this.props.onIconClick) {
            event.preventDefault();
            event.stopPropagation();
            this.props.onIconClick(this);
        }
    }

    public getType(): string | null {
        const input = this.element?.querySelector<HTMLInputElement>('.field__input');
        if (input) {
            return input.type;
        }

        return null;
    }

    public setType(type: string): void {
        const input = this.element?.querySelector<HTMLInputElement>('.field__input');
        if (input) {
            input.type = type;
        }
    }

    public setIcon(iconPath: string): void {
        const image = this.element?.querySelector<HTMLImageElement>('.field__icon-image');
        if (image) {
            image.src = iconPath;
        }
    }

    public setError(message: string): void {
        if (!this.element) {
            return;
        }

        this.element.classList.add('field--error');

        const messageSpan = this.element.querySelector('.field__message');
        if (messageSpan) {
            messageSpan.textContent = message;
        }
    }

    public clearError(): void {
        if (!this.element) {
            return;
        }

        this.element.classList.remove('field--error');

        const messageSpan = this.element.querySelector('.field__message');
        if (messageSpan) {
            messageSpan.textContent = '';
        }
    }

    public render(): HTMLElement {
        this.element = stringToElement(template(this.props));
        this.initListeners();
        return this.element;
    }
}
