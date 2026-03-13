import { stringToElement } from '@/shared/utils';
import template from './Hero.hbs?compiled';
import './style.scss';

import { SearchBar } from '@/features/SearchBar';

export class Hero {
    constructor(props) {
        this.props = props;

        this.searchBar = new SearchBar({
            className: 'hero__search'
        });
    }

    render() {
        this.element = stringToElement(template(this.props));

        this.element.querySelector('[data-slot="search-bar"]')
            .replaceWith(this.searchBar.render());

        return this.element;
    }
}
