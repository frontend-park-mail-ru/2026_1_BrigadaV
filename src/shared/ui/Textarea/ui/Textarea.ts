import './style.scss';

import { BaseComponent } from '@/shared/lib/component/BaseComponent';
import { stringToElement } from '@/shared/utils';

import { TextareaProps } from '../model/types';
import template from './Textarea.hbs?compiled';

export class Textarea extends BaseComponent {
    constructor(private props: TextareaProps) { super(); }

    public setError(message: string): void {
        if (!this.element) return;

        this.element.classList.add('textarea--error');

        const messageSpan = this.element.querySelector('.textarea__message');
        if (messageSpan) {
            messageSpan.textContent = message;
        }
    }

    public clearError(): void {
        if (!this.element) return;

        this.element.classList.remove('textarea--error');

        const messageSpan = this.element.querySelector('.textarea__message');
        if (messageSpan) {
            messageSpan.textContent = '';
        }
    }

    public setValue(value?: string | number): void {
        if (!this.element || !value) return;

        const input = this.element.querySelector<HTMLTextAreaElement>('.textarea__input');
        if (input) {
            input.value = value.toString();
        }
    }

    protected override _render(): HTMLElement {
        return stringToElement(template(this.props));
    }
}
