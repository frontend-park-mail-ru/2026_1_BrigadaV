/**
 * @module SignupPage
 * @description Компонент страницы регистрации нового пользователя
 */
import template from './SignupPage.hbs?compiled';
import './style.scss';

import { Header } from '@/widgets/Header';
import { RegisterForm } from '@/widgets/RegisterForm';

/**
 * Класс страницы регистрации
 * @class SignupPage
 * @description Отображает форму регистрации и шапку с предложением войти
 */
export class SignupPage {
    constructor(appState) {
        /**
          * Виджет шапки с навигацией
          * @type {Header}
          * @private
          */
        this.header = new Header({
            user: appState.currentUser,
            authPrompt: {
                prompt: 'Уже есть аккаунт?',
                href: '/login',
                buttonText: 'Войдите'
            }
        });
        /**
          * Форма регистрации
          * @type {RegisterForm}
          * @private
          */
        this.registerForm = new RegisterForm({
            className: 'sign-up__form',
            submitText: 'Создать аккаунт',
            redirectText: 'Войти',
            redirectHref: '/login'
        });
    }

    /**
     * Рендерит страницу регистрации
     * 
     * @returns {HTMLElement} DOM-элемент страницы
     * 
     * @example
     * const page = new SignupPage(appState);
     * const element = page.render();
     * root.appendChild(element);
     */
    render() {
        this.element = document.createElement('div');
        const html = template();

        this.element.classList.add('page-wrapper');
        this.element.innerHTML = html;

        this.element.querySelector('[data-slot="header"]')
            .replaceWith(this.header.render());
        this.element.querySelector('[data-slot="register-form"]')
            .replaceWith(this.registerForm.render());

        return this.element;
    }

    /**
     * Очищает ресурсы страницы при уничтожении
     * 
     * @returns {void}
     * 
     * @example
     * // При переходе на другую страницу
     * page.destroy();
     */
    destroy() {
        if (this.header) {
            this.header.destroy();
        }
    }
}
