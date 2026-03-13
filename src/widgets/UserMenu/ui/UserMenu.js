import template from './UserMenu.hbs?compiled';
import './style.scss';

import { stringToElement } from '@/shared/utils';

import { appState } from '@/shared/config/router';
import { API } from '@/shared/api/api';
import { navigate } from '@/shared/router/router';

export class UserMenu {
    constructor(props) {
        this.props = props;
    }

    initListeners() {
        this.element.addEventListener('click', async (event) => {
            const logoutButton = event.target.closest('.js-logout');

            if (logoutButton) {
                try {
                    await API.logout();
                    appState.currentUser = null;
                    navigate(window.location.pathname);
                } catch {
                    // TODO Сделать вывод ошибок тост сообщением
                }
            }
        });
    }

    hide() {
        this.element.classList.remove('user-menu--active');
    }

    show() {
        this.element.classList.add('user-menu--active');
    }

    toggle() {
        this.element.classList.toggle('user-menu--active');
    }

    render() {
        this.element = stringToElement(template(this.props));
        this.initListeners();
        return this.element;
    }
}
