import template from './SearchBar.hbs?compiled';
import './style.scss'

import { Field } from '@/shared/ui/Field';
import { stringToElement } from '@/shared/utils';

export class SearchBar {
    constructor(props) {
        this.element = stringToElement(template(props));

        this.searchField = new Field({
            type: "text",
            className: "search__input",
            placeholder: "Куда бы вы хотели отправиться?",
            hasIcon: true,
            iconPath: "/icons/search.svg"
        })

        this.element.querySelector('[data-slot="search-field"]')
            .replaceWith(this.searchField.render());
    }

    render() {
        return this.element;
    }
}
