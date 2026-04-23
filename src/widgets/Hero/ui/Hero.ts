import './style.scss';

import { SearchBar } from '@/features/SearchBar';
import { BaseComponent } from '@/shared/lib/component/BaseComponent';
import { stringToElement } from '@/shared/utils';

import template from './Hero.hbs?compiled';

export class Hero extends BaseComponent {
    declare protected children: {
        searchBar: SearchBar;
    };

    constructor() {
        super();

        this.children = {
            searchBar: new SearchBar({
                className: 'hero__search',
                withButton: true,
                placeholder: 'Куда бы вы хотели отправиться?',
            })
        };
    }

    protected override _render(): HTMLElement {
        return stringToElement((template()));
    }
}
