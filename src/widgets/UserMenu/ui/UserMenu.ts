import './style.scss';

import { logoutUser } from '@/entities/User';
import { appState } from '@/shared/config';
import { BaseComponent } from '@/shared/lib/component/BaseComponent';
import { navigate } from '@/shared/router';
import { ConfirmPopup } from '@/shared/ui/ConfirmPopup';
import { stringToElement } from '@/shared/utils';

import { UserMenuProps } from '../model/types';
import template from './UserMenu.hbs?compiled';

export class UserMenu extends BaseComponent {
    constructor(private props: UserMenuProps) { super(); }

    protected override initListeners(): void {
        super.initListeners();
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
                    await logoutUser();
                    appState.currentUser = null;
                    navigate(window.location.pathname);
                }
            } catch {
                // TODO Сделать вывод ошибок тост сообщением
            }
        }
    };

    public hide(): void {
        this.element?.classList.remove('user-menu--active');
    }

    public show(): void {
        this.element?.classList.add('user-menu--active');
    }

    public toggle(): void {
        this.element?.classList.toggle('user-menu--active');
    }

    protected override _render(): HTMLElement {
        return stringToElement(template(this.props));
    }
}
