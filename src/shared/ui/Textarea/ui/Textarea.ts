import './style.scss';

import { stringToElement } from '@/shared/utils';

import { TextareaProps } from '../model/types';
import template from './Textarea.hbs?compiled';

export class Textarea {
    private element?: HTMLElement;

    constructor(private props: TextareaProps) { }

    public setError(message: string): void {
        if (!this.element) {
            return;
        }

        this.element.classList.add('Textarea--error');

        const messageSpan = this.element.querySelector('.Textarea__message');
        if (messageSpan) {
            messageSpan.textContent = message;
        }
    }

    public clearError(): void {
        if (!this.element) {
            return;
        }

        this.element.classList.remove('Textarea--error');

        const messageSpan = this.element.querySelector('.Textarea__message');
        if (messageSpan) {
            messageSpan.textContent = '';
        }
    }

    public setValue(value?: string): void {
        if (!this.element || !value) return;

        const input = this.element.querySelector<HTMLTextAreaElement>('.textarea__input');
        if (input) {
            input.value = value;
        }
    }

    public render(): HTMLElement {
        this.element = stringToElement(template(this.props));
        return this.element;
    }
}
