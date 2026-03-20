import './style.scss';

import { AppState, IPage } from '@/shared/model';
import { Header } from '@/widgets/Header';
import { Hero } from '@/widgets/Hero';
import { RecommendedList } from '@/widgets/RecommendedList';

import template from './LandingPage.hbs?compiled';

export class LandingPage implements IPage {
    private element?: HTMLElement;
    private header?: Header;
    private hero?: Hero;
    private recommendedList?: RecommendedList;

    constructor(appState: AppState) {
        this.header = new Header({
            userSessionProps: {
                user: appState.currentUser
            }
        });

        this.hero = new Hero();

        this.recommendedList = new RecommendedList({
            user: appState.currentUser
        });

    }

    public render(): HTMLElement {
        this.element = document.createElement('div');
        const html = template();

        this.element.classList.add('page-wrapper');
        this.element.innerHTML = html;

        if (this.header) {
            this.element.querySelector('[data-slot="header"]')
                ?.replaceWith(this.header.render());
        }

        if (this.hero) {
            this.element.querySelector('[data-slot="hero"]')
                ?.replaceWith(this.hero.render());
        }

        if (this.recommendedList) {
            this.element.querySelector('[data-slot="recommended-list"]')
                ?.replaceWith(this.recommendedList.render());
        }

        return this.element;
    }

    public destroy(): void {
        if (this.header) {
            this.header.destroy();
        }
    }
}
