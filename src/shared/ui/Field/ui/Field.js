import template from "./Field.hbs?compiled";
import './style.scss';

import { togglePasswordVisibility } from "../handlers/togglePasswordVisibility";
import { stringToElement } from "@/shared/utils";

export class Field {
    constructor(props) {
        this.props = props;
        this.element = stringToElement(template(this.props));
        this.initListeners();
    }

    initListeners() {
        if (this.props.hasIcon) {
            const button = this.element.querySelector('.field__icon');
            button?.addEventListener('click', () => togglePasswordVisibility(this));
        }
    }

    setError(message) {
        this.element.classList.add('field--error');

        const messageSpan = this.element.querySelector('.field__message');
        if (messageSpan) {
            messageSpan.textContent = message;
        }
    }

    clearError() {
        this.element.classList.remove('field--error');

        const messageSpan = this.element.querySelector('.field__message');
        if (messageSpan) {
            messageSpan.textContent = '';
        }
    }

    render() {
        return this.element;
    }
}
