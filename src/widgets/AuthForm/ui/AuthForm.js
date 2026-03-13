/**
 * @module AuthForm
 * @description Компонент формы авторизации
 */
import template from './AuthForm.hbs?compiled';
import './style.scss';

import { Field } from '@/shared/ui/Field';
import { stringToElement } from '@/shared/utils';
import { handleSubmit } from '../handlers/handleSubmit';

/**
 * Класс формы авторизации
 * @class AuthForm
 * @description Отображает поля для ввода логина и пароля с обработкой отправки
 */
export class AuthForm {
    constructor(props) {
        /**
         * Свойства формы
         * @type {Object}
         * @private
         */
        this.props = props;

        /**
         * Поле ввода логина
         * @type {Field}
         * @private
         */
        this.loginField = new Field({
            className: 'auth-form__login-field',
            id: 'login-input',
            label: 'Введите почту',
            type: 'text',
            attributes: {
                name: 'login',
                placeholder: 'мояпочта@gmail.com',
                autocomplete: 'email',
                maxlength: 50,
            },
            hasIcon: false,
        });

        /**
         * Поле ввода пароля
         * @type {Field}
         * @private
         */
        this.passwordField = new Field({
            className: 'auth-form__password-field',
            id: 'password-input',
            label: 'Введите пароль',
            type: 'password',
            attributes: {
                name: 'password',
                placeholder: 'Пароль',
                autocomplete: 'current-password',
                maxlength: 50,
            },
            hasIcon: true,
            iconPath: '/icons/eye.svg'
        });
    }

    /**
     * Инициализирует обработчик отправки формы
     * @private
     * @returns {void}
     */
    initSubmit() {
        this.element.addEventListener('submit', async (event) => handleSubmit(this, event));
    }

    /**
     * Очищает ошибки во всех полях формы
     * @returns {void}
     */
    clearErrors() {
        this.loginField.clearError();
        this.passwordField.clearError();
    }

    /**
     * Рендерит форму авторизации
     * 
     * @returns {HTMLElement} DOM-элемент формы
     */
    render() {
        this.element = stringToElement(template(this.props));

        this.element.querySelector('[data-slot="login"]')
            .replaceWith(this.loginField.render());
        this.element.querySelector('[data-slot="password"]')
            .replaceWith(this.passwordField.render());

        this.initSubmit();

        return this.element;
    }
}
