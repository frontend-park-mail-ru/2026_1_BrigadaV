import './style.scss';

import { stringToElement } from '@/shared/utils';
import { UserMenu } from '@/widgets/UserMenu';

import { UserSessionProps } from '../model/types';
import template from './UserSession.hbs?compiled';

export class UserSession {
    private menu: UserMenu | null = null;
    private element: HTMLElement | null = null;

    constructor(private props: UserSessionProps) {
        if (this.props.user) {
            this.menu = new UserMenu();
        }
    }

    private initMenu(): void {
        document.removeEventListener('click', this.handleGlobalClick);

        const userMenuSlot = this.element?.querySelector('[data-slot="user-menu"]');

        if (userMenuSlot && this.menu) {
            userMenuSlot.replaceWith(this.menu.render());
            document.addEventListener('click', this.handleGlobalClick);
        }
    }

    private handleGlobalClick = (event: Event): void => {
        const target = event.target;

        if (!(target instanceof HTMLElement) || !this.menu) {
            return;
        }

        const isClickInsideToggle = target.closest('.js-session-toggle');
        const isClickInsideMenu = target.closest('.js-user-menu');

        if (isClickInsideToggle) {
            this.menu.toggle();
        } else if (!isClickInsideMenu) {
            this.menu.hide();
        }
    }

    public render(): HTMLElement {
        this.element = stringToElement(template(this.props));
        if (this.menu) {
            this.initMenu();
        }

        return this.element;
    }

    public destroy(): void {
        document.removeEventListener('click', this.handleGlobalClick);
    }
}
