import { injectComponents, stringToElement } from '@/shared/utils';
import { UserMenu } from '@/widgets/UserMenu';

import { UserSessionProps } from '../model/types';
import styles from './style.module.scss';
import template from './UserSession.hbs?compiled';
import { eventBus } from '@/shared/lib';

export class UserSession {
    private menu?: UserMenu;
    private element?: HTMLElement;

    constructor(private props: UserSessionProps) {
        if (this.props.user) {
            this.menu = new UserMenu({
                className: styles['user-profile__menu'],
            });
        }
    }

    private initListeners() {
        eventBus.on('user:update', this.update);
    }

    private update = ({ nickname }) => {
        if (!this.props.user) return;

        const nicknameField = this.element?.querySelector('[data-ref="nickname"]');
        if (nicknameField) nicknameField.textContent = nickname;
    }

    private initMenu(): void {
        const userMenuSlot = this.element?.querySelector('[data-slot="user-menu"]');

        if (userMenuSlot && this.menu) {
            userMenuSlot.replaceWith(this.menu.render());
            document.addEventListener('click', this.handleGlobalClick);

            this.element?.querySelector('.js-session-toggle')?.addEventListener('keydown', (event: KeyboardEvent) => {
                if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    this.menu?.toggle();
                }
            })
        }
    }

    private handleGlobalClick = (event: Event): void => {
        const target = event.target;

        if (!(target instanceof HTMLElement) || !this.menu) {
            return;
        }

        const isClickInsideToggle = target.closest('[data-ref="nickname"') || target.closest('[data-ref="avatar"]');
        const isClickInsideMenu = target.closest('.js-user-menu');

        if (!!isClickInsideToggle) {
            this.menu.toggle();
        } else if (!isClickInsideMenu) {
            this.menu.hide();
        }
    }

    public render(): HTMLElement {
        this.element = stringToElement(template({
            ...this.props,
            styles
        }));

        if (this.menu) {
            this.initMenu();
        }

        this.initListeners();

        return this.element;
    }

    public destroy(): void {
        document.removeEventListener('click', this.handleGlobalClick);
    }
}
