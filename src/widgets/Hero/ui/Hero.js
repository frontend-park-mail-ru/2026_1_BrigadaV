import { stringToElement } from '@/shared/utils';
import template from './Hero.hbs?compiled';
import './style.scss'

import { SearchBar } from '@/features/SearchBar';

export class Hero {
    constructor(props) {
        this.element = stringToElement(template(props));

        this.searchBar = new SearchBar({
            className: "hero__search"
        })

        this.element.querySelector('[data-slot="search-bar"]')
            .replaceWith(this.searchBar.render());
    }

    render() {
        return this.element;
    }
}
