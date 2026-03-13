import template from './LandingPage.hbs?compiled';
import './style.scss';

import { Header } from '@/widgets/Header';
import { Hero } from '@/widgets/Hero';
import { RecommendedList } from '@/widgets/RecommendedList';

export class LandingPage {
    constructor(appState) {
        this.header = new Header({
            user: appState.currentUser
        });

        this.hero = new Hero();

        this.recommendedList = new RecommendedList({
            user: appState.currentUser
        });

    }

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

    destroy() {
        if (this.header) {
            this.header.destroy();
        }
    }
}
