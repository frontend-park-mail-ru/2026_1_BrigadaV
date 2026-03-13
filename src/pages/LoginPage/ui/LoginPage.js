/**
 * @module LoginPage
 * @description Компонент страницы входа в систему
 */
import template from './LoginPage.hbs?compiled';
import './style.scss';

import { Header } from '@/widgets/Header';
import { AuthForm } from '@/widgets/AuthForm';

/**
 * Класс страницы входа
 * @class LoginPage
 * @description Отображает форму авторизации и шапку с предложением регистрации
 */
export class LoginPage {
    /**
     * Создаёт экземпляр страницы входа
     * 
     * @constructor
     * @param {Object} appState - Глобальное состояние приложения
     * @param {Object|null} appState.currentUser - Данные текущего пользователя
     */
    constructor(appState) {
        /**
         * Виджет шапки с навигацией
         * @type {Header}
         * @private
         */
        this.header = new Header({
            user: appState.currentUser,
            authPrompt: {
                prompt: 'Ещё нет аккаунта?',
                href: '/sign-up',
                buttonText: 'Регистрация'
            }
        });

        /**
         * Форма авторизации
         * @type {AuthForm}
         * @private
         */
        this.authForm = new AuthForm({
            className: 'log-in__form',
            submitText: 'Войти',
            redirectText: 'Создать аккаунт',
            redirectHref: '/sign-up'
        });
    }

    /**
     * Рендерит страницу входа
     * 
     * @returns {HTMLElement} DOM-элемент страницы
     * 
     * @example
     * const page = new LoginPage(appState);
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
        this.element.querySelector('[data-slot="auth-form"]')
            .replaceWith(this.authForm.render());

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
