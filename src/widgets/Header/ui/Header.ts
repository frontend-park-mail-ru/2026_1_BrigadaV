import './style.scss';

import { SearchBar } from '@/features/SearchBar';
import { BaseComponent } from '@/shared/lib/component/BaseComponent';
import { stringToElement } from '@/shared/utils';
import { UserSession } from '@/widgets/UserSession';

import { HeaderProps } from '../model/types';
import template from './Header.hbs?compiled';

export class Header extends BaseComponent {
    declare protected children: {
        userSession: UserSession;
        searchBar?: SearchBar;
    };

    constructor(props: HeaderProps) {
        super();
        this.children = {
            userSession: new UserSession({
                className: 'header__account',
                user: props.user,
                authPrompt: props.authPrompt
            }),

            ...(props.withSearch && {
                searchBar: new SearchBar({
                    className: 'header__search',
                    placeholder: 'Поиск',
                })
            }),
        };
    }

    protected _render() {
        return stringToElement(template());
    }
}
