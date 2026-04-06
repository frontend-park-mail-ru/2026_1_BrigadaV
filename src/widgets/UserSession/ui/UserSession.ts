import styles from './style.module.scss';

import { injectComponents, stringToElement } from '@/shared/utils';
import { UserMenu } from '@/widgets/UserMenu';

import { UserSessionProps } from '../model/types';
import template from './UserSession.hbs?compiled';

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

    public render(): HTMLElement {
        this.element = stringToElement(template({
            ...this.props,
            styles
        }));

        injectComponents(this.element, {
            'user-menu': this.menu,
        });

        return this.element;
    }
}
