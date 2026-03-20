import './style.scss';

import { API } from '@/shared/api';
import { appState } from '@/shared/config';
import { navigate } from '@/shared/router';
import { stringToElement } from '@/shared/utils';

import template from './UserMenu.hbs?compiled';

export class UserMenu {
    private element?: HTMLElement;

    constructor() { }

    initListeners(): void {
        this.element?.addEventListener('click', this.handleClick);
    }

    private handleClick = async (event: Event): Promise<void> => {
        const target = event.target;
        if (!(target instanceof HTMLElement)) {
            return;
        }

        const logoutButton = target.closest('.js-logout');

        if (logoutButton) {
            try {
                await API.logout();
                appState.currentUser = null;
                navigate(window.location.pathname);
            } catch {
                // TODO Сделать вывод ошибок тост сообщением
            }
        }
    }

    public hide(): void {
        this.element?.classList.remove('user-menu--active');
    }

    public show(): void {
        this.element?.classList.add('user-menu--active');
    }

    public toggle(): void {
        this.element?.classList.toggle('user-menu--active');
    }

    public render(): HTMLElement {
        this.element = stringToElement(template());
        this.initListeners();
        return this.element;
    }
}
