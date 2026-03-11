import { stringToElement } from '@/shared/utils';
import template from './Header.hbs?compiled';
import './style.scss';

import { UserSession } from '@/widgets/UserSession';

export class Header {
    constructor(props) {
        this.element = stringToElement(template());

        this.userSessionSlot = this.element.querySelector('[data-slot="user-session"]');

        this.userSession = new UserSession({
            className: "header__account",
            ...props
        })

        this.element.querySelector('[data-slot="user-session"]')
            .replaceWith(this.userSession.render());
    }

    render() {
        return this.element;
    }
}
