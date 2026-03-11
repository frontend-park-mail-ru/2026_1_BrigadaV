import template from './AuthForm.hbs?compiled';
import './style.scss';

import { Field } from '@/shared/ui/Field';
import { stringToElement } from '@/shared/utils';
import { handleSubmit } from '../handlers/handleSubmit';

export class AuthForm {
    constructor(props) {
        this.element = stringToElement(template(props));

        this.loginField = new Field({
            className: 'auth-form__login-field',
            id: 'login-input',
            label: 'Введите почту',
            type: 'text',
            attributes: {
                name: 'login',
                placeholder: 'мояпочта@gmail.com',
                autocomplete: 'email',
            },
            hasIcon: false,
        });

        this.passwordField = new Field({
            className: 'auth-form__password-field',
            id: 'password-input',
            label: 'Введите пароль',
            type: 'password',
            attributes: {
                name: 'password',
                placeholder: 'Пароль',
                autocomplete: 'current-password',
            },
            hasIcon: true,
            iconPath: '/icons/eye.svg'
        });

        this.element.querySelector('[data-slot="login"]')
            .replaceWith(this.loginField.render());
        this.element.querySelector('[data-slot="password"]')
            .replaceWith(this.passwordField.render());

        this.initSubmit();
    }

    initSubmit() {
        this.element.addEventListener('submit', async (event) => handleSubmit(this, event));
    }

    clearErrors() {
        this.loginField.clearError();
        this.passwordField.clearError();
    }

    render() {
        return this.element;
    }
}
