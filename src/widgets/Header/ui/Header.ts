import './style.scss';

import { stringToElement } from '@/shared/utils';
import { UserSession } from '@/widgets/UserSession';

import { HeaderProps } from '../model/types';
import template from './Header.hbs?compiled';
import { SearchBar } from '@/features/SearchBar';

export class Header {
    private element?: HTMLElement;
    private userSession?: UserSession;
    private searchBar?: SearchBar;

    constructor(props: HeaderProps) {
        this.userSession = new UserSession({
            ...props.userSessionProps,
            className: 'header__account',
        });

        if (props.withSearch) {
            this.searchBar = new SearchBar({
                className: 'header__search',
                placeholder: 'Поиск',
            });
        }
    }

    public render(): HTMLElement {
        this.element = stringToElement(template());

        if (this.userSession) {
            this.element.querySelector('[data-slot="user-session"]')
                ?.replaceWith(this.userSession.render());
        }

        if (this.searchBar) {
            this.element.querySelector('[data-slot="search-bar"]')
                ?.replaceWith(this.searchBar.render());
        }

        return this.element;
    }

    public destroy(): void { }
}
