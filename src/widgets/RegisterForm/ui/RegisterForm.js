import template from './RegisterForm.hbs?compiled';
import './style.scss';

import { Field } from '@/shared/ui/Field';
import { stringToElement } from '@/shared/utils';
import { handleSubmit } from '../handlers/handleSubmit';

export class RegisterForm {
    constructor(props) {
        this.props = props;

        this.nicknameField = new Field({
            className: 'register-form__field',
            id: 'nickname-input',
            label: 'Введите никнейм',
            type: 'login',
            attributes: {
                name: 'nickname',
                placeholder: 'Никнейм',
                maxlength: 20,
            },
            hasIcon: false,
        });

        this.loginField = new Field({
            className: 'register-form__login-field',
            id: 'login-input',
            label: 'Введите почту',
            type: 'text',
            autocomplete: 'email',
            attributes: {
                name: 'login',
                placeholder: 'Почта',
                maxlength: 50,
            },
            hasIcon: false,
        });

        this.passwordField = new Field({
            className: 'register-form__field',
            id: 'password-input',
            label: 'Введите пароль',
            type: 'password',
            autocomplete: 'current-password',
            attributes: {
                name: 'password',
                placeholder: 'Пароль',
                maxlength: 50,
            },
            hasIcon: true,
            iconPath: '/icons/eye.svg'
        });

        this.passwordRepeatField = new Field({
            className: 'register-form__password-repeat-field',
            id: 'password-input',
            label: 'Повторите пароль',
            type: 'password',
            attributes: {
                name: 'password-repeat',
                placeholder: 'Пароль',
                maxlength: 50,
            },
            hasIcon: true,
            iconPath: '/icons/eye.svg'
        });

        this.fieldMap = {
            nickname: this.nicknameField,
            login: this.loginField,
            password: this.passwordField,
            'password-repeat': this.passwordRepeatField,
        };
    }

    initSubmit() {
        this.element.addEventListener('submit', async (event) => handleSubmit(this, event));
    }

    clearErrors() {
        this.nicknameField.clearError();
        this.loginField.clearError();
        this.passwordField.clearError();
        this.passwordRepeatField.clearError();
    }

    render() {
        this.element = stringToElement(template(this.props));

        this.element.querySelector('[data-slot="nickname"]')
            .replaceWith(this.nicknameField.render());

        this.element.querySelector('[data-slot="login"]')
            .replaceWith(this.loginField.render());

        this.element.querySelector('[data-slot="password"]')
            .replaceWith(this.passwordField.render());

        this.element.querySelector('[data-slot="password-repeat"]')
            .replaceWith(this.passwordRepeatField.render());

        this.initSubmit();

        return this.element;
    }
}
