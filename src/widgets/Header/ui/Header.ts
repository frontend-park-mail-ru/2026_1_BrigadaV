import './style.scss';

import { stringToElement } from '@/shared/utils';
import { UserSession } from '@/widgets/UserSession';

import { HeaderProps } from '../model/types';
import template from './Header.hbs?compiled';

export class Header {
    private element: HTMLElement | null = null;
    private userSession: UserSession | null = null;

    constructor(props: HeaderProps) {
        this.userSession = new UserSession({
            ...props.userSessionProps,
            className: 'header__account',
        });
    }

    public render(): HTMLElement {
        this.element = stringToElement(template());

        if (this.userSession) {
            this.element.querySelector('[data-slot="user-session"]')
                ?.replaceWith(this.userSession.render());
        }

        return this.element;
    }

    public destroy(): void {
        if (this.userSession) {
            this.userSession.destroy();
        }
    }
}
