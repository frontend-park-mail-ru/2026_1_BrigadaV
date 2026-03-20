import './style.scss';

import { SearchBar } from '@/features/SearchBar';
import { stringToElement } from '@/shared/utils';

import template from './Hero.hbs?compiled';

export class Hero {
    private element?: HTMLElement;
    private searchBar?: SearchBar;

    constructor() {
        this.searchBar = new SearchBar({
            className: 'hero__search'
        });
    }

    public render(): HTMLElement {
        this.element = stringToElement(template());

        if (this.searchBar) {
            this.element.querySelector('[data-slot="search-bar"]')
                ?.replaceWith(this.searchBar.render());
        }

        return this.element;
    }
}
