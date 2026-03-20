import './style.scss';

import { Field } from '@/shared/ui';
import { stringToElement } from '@/shared/utils';

import { SearchBarProps } from './model/types';
import template from './SearchBar.hbs?compiled';

export class SearchBar {
    private element?: HTMLElement;
    private searchField?: Field;

    constructor(private props: SearchBarProps) {
        this.searchField = new Field({
            type: 'text',
            className: 'search__field',
            iconPath: '/icons/search.svg',
            attributes: {
                placeholder: 'Куда бы вы хотели отправиться?',
            }
        });
    }

    public render(): HTMLElement {
        this.element = stringToElement(template(this.props));

        if (this.searchField) {
            this.element.querySelector('[data-slot="search-field"]')
                ?.replaceWith(this.searchField.render());
        }

        return this.element;
    }
}
