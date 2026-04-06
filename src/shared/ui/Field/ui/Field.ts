import './style.scss';

import { stringToElement } from '@/shared/utils';

import { FieldProps } from '../model/types';
import template from './Field.hbs?compiled';

export class Field {
    private element?: HTMLElement;

    constructor(private props: FieldProps) { }

    private initListeners(): void {
        const leftButton = this.element?.querySelector('button[data-position="left"]');

        if (leftButton && this.props.leftIcon && this.props.onLeftIconClick) {
            leftButton.addEventListener('click', this.handleIconClick);
        }

        const rightButton = this.element?.querySelector('button[data-position="right"]');

        if (rightButton && this.props.rightIcon && this.props.onRightIconClick) {
            rightButton.addEventListener('click', this.handleIconClick);
        }
    }

    private handleIconClick = (event: Event): void => {
        const button = event.currentTarget;

        if (!(button instanceof HTMLElement)) {
            return;
        }

        event.preventDefault();
        event.stopPropagation();

        if (button.dataset.position === 'left' && this.props.onLeftIconClick) {
            this.props.onLeftIconClick(this);
        }

        if (button.dataset.position === 'right' && this.props.onRightIconClick) {
            this.props.onRightIconClick(this);
        }

    };

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

    public setIcon(iconPath: string, position: 'left' | 'right'): void {
        const image = this.element?.querySelector<HTMLImageElement>(`img[data-position="${position}"]`);

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

    public setValue(value?: string): void {
        if (!this.element || !value) return;

        const input = this.element.querySelector<HTMLInputElement>('.field__input');
        if (input) {
            input.value = value;
        }
    }

    public focus(): void {
        if (!this.element) return;

        this.element.querySelector<HTMLInputElement>('.field__input')?.focus();
    }

    public render(): HTMLElement {
        this.element = stringToElement(template(this.props));
        this.initListeners();
        return this.element;
    }
}
