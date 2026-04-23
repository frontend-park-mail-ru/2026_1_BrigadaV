import { UserSummary } from '@/entities/User';
import { BaseComponent } from '@/shared/lib/component/BaseComponent';
import { stringToElement } from '@/shared/utils';
import { UserMenu } from '@/widgets/UserMenu';

import { UserSessionProps } from '../model/types';
import styles from './style.module.scss';
import template from './UserSession.hbs?compiled';

export class UserSession extends BaseComponent {
    declare protected children: {
        menu?: UserMenu;
    };

    protected override get eventHandlers() {
        return {
            'user:update': this.update,
        };
    }

    private fields: Record<string, HTMLElement> = {};

    constructor(private props: UserSessionProps) {
        super();

        this.children = {
            ...(props.user && {
                menu: new UserMenu({
                    className: styles['user-profile__menu'],
                })
            }),
        };
    }

    private initFields(element: HTMLElement) {
        const refs = element.querySelectorAll<HTMLElement>('[data-ref]');
        refs.forEach((item) => {
            const key = item.dataset.ref!;
            this.fields[key] = item;
        });
    }
    private update = (data: Pick<UserSummary, 'nickname' | 'avatar'>) => {
        if (!this.props.user) return;

        if (data.nickname) this.fields['nickname'].textContent = data.nickname;
        if (data.avatar && this.fields['avatar'] instanceof HTMLImageElement) this.fields['avatar'].src = data.avatar;
    };

    private handleGlobalClick = (event: Event): void => {
        const target = event.target;

        const { menu } = this.children;

        if (!(target instanceof HTMLElement) || !menu) {
            return;
        }

        const isClickInsideMenu = target.closest('.js-user-menu');
        const isClickInsideToggle = !isClickInsideMenu && target.closest('.js-session-toggle');

        if (isClickInsideToggle) {
            menu.toggle();
        } else if (!isClickInsideMenu) {
            menu.hide();
        }
    };

    private handleToggleKeydown = (event: KeyboardEvent): void => {
        const { menu } = this.children;

        if (!menu) return;

        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            menu.toggle();
        }
    };

    protected override initListeners(): void {
        super.initListeners();
        const { menu } = this.children;

        if (menu) {
            document.addEventListener('click', this.handleGlobalClick);

            const toggleButton = this.element?.querySelector<HTMLElement>('.js-session-toggle');
            toggleButton?.addEventListener('keydown', this.handleToggleKeydown);
        }
    }

    protected override _render(): HTMLElement {
        const element = stringToElement(template({
            ...this.props,
            styles
        }));

        if (this.props.user) this.initFields(element);

        return element;
    }

    public override destroy(): void {
        super.destroy();
        document.removeEventListener('click', this.handleGlobalClick);
    }
}
