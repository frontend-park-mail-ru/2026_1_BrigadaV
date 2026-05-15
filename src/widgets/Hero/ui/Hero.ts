import './style.scss';

import { SearchBar } from '@/features/SearchBar';
import { BaseComponent } from '@/shared/lib/component/BaseComponent';
import { stringToElement } from '@/shared/utils';

import heroBg from '../assets/hero-bg.png';
import { HeroProps } from '../model/types';
import template from './Hero.hbs?compiled';

export class Hero extends BaseComponent {
    declare protected children: {
        searchBar: SearchBar;
    };

    constructor(private props: HeroProps) {
        super();

        this.children = {
            searchBar: this.props.searchSlot
        };
    }

    protected override _render(): HTMLElement {
        return stringToElement(template({ heroBg }));
    }
}
