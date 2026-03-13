import { stringToElement } from '@/shared/utils';
import template from './Header.hbs?compiled';
import './style.scss';

import { UserSession } from '@/widgets/UserSession';

export class Header {
    constructor(props) {
        this.props = props;

        this.userSession = new UserSession({
            className: 'header__account',
            ...props
        });

    }

    render() {
        this.element = stringToElement(template());

        this.userSessionSlot = this.element.querySelector('[data-slot="user-session"]');
        this.element.querySelector('[data-slot="user-session"]')
            .replaceWith(this.userSession.render());

        return this.element;
    }

    destroy() {
        this.userSession.destroy();
    }
}
