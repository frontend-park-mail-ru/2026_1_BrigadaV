import './style.scss';

import { API } from '@/shared/api';
import { appState } from '@/shared/config';
import { navigate } from '@/shared/router';
import { stringToElement } from '@/shared/utils';

import template from './UserMenu.hbs?compiled';
import { UserMenuProps } from '../model/types';
import { ConfirmPopup } from '@/shared/ui/ConfirmPopup';

export class UserMenu {
    private element?: HTMLElement;

    constructor(private props: UserMenuProps) { }

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
                const confirmed = await ConfirmPopup({
                    prompt: 'Вы действительно хотите выйти из аккаунта?',
                    cancelText: 'Отменить',
                    confirmText: 'Выйти',
                });

                if (confirmed) {
                    await API.logout();
                    appState.currentUser = null;
                    navigate(window.location.pathname);
                }
            } catch {
                // TODO Сделать вывод ошибок тост сообщением
            }
        }
    };

    public render(): HTMLElement {
        this.element = stringToElement(template(this.props));
        this.initListeners();
        return this.element;
    }
}
