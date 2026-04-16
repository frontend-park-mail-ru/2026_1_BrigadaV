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
                id: 'user-menu',
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


    public render(): HTMLElement {
        this.element = stringToElement(template({
            ...this.props,
            styles
        }));

        injectComponents(this.element, {
            'user-menu': this.menu,
        });

        this.initListeners();

        return this.element;
    }
}
