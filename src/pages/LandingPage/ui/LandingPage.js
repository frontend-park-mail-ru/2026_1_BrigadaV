import template from './LandingPage.hbs?compiled';
import './style.scss';

import { Header } from '@/widgets/header';
import { Hero } from '@/widgets/hero';
import { RecommendedList } from '@/widgets/RecommendedList';

export class LandingPage {
    constructor(appState) {
        this.element = document.createElement('div');
        const html = template();

        this.element.classList.add('page-wrapper');
        this.element.innerHTML = html;

        this.header = new Header({
            user: appState.currentUser
        })

        this.hero = new Hero();

        this.recommendedList = new RecommendedList({
            user: appState.currentUser
        });

        this.element.querySelector('[data-slot="header"]')
            .replaceWith(this.header.render());

        this.element.querySelector('[data-slot="hero"]')
            .replaceWith(this.hero.render());

        this.element.querySelector('[data-slot="recommended-list"]')
            .replaceWith(this.recommendedList.render());
    }

    render() {
        return this.element;
    }
}
