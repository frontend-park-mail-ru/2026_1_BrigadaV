/**
 * @module LandingPage
 * @description Компонент главной страницы приложения
 */
import template from './LandingPage.hbs?compiled';
import './style.scss';

import { Header } from '@/widgets/Header';
import { Hero } from '@/widgets/Hero';
import { RecommendedList } from '@/widgets/RecommendedList';

/**
 * Класс главной страницы
 * @class LandingPage
 * @description Собирает главную страницу из виджетов
 */
export class LandingPage {
    /**
     * Создаёт экземпляр главной страницы
     * 
     * @constructor
     * @param {Object} appState - Глобальное состояние приложения
     * @param {Object} appState.currentUser - Данные текущего пользователя
     */
    constructor(appState) {
        /**
         * Виджет шапки
         * @type {Header}
         * @private
         */
        this.header = new Header({
            user: appState.currentUser
        });

        /**
         * Виджет секции
         * @type {Hero}
         * @private
         */
        this.hero = new Hero();

        /**
         * Виджет списка рекомендуемых мест
         * @type {RecommendedList}
         * @private
         */
        this.recommendedList = new RecommendedList({
            user: appState.currentUser
        });

    }

    /**
     * Рендерит главную страницу
     * 
     * @returns {HTMLElement} DOM-элемент страницы
     * 
     * @example
     * const page = new LandingPage(appState);
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
        this.element.querySelector('[data-slot="hero"]')
            .replaceWith(this.hero.render());
        this.element.querySelector('[data-slot="recommended-list"]')
            .replaceWith(this.recommendedList.render());

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
