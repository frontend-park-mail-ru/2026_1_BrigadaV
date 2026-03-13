import template from './UserSession.hbs?compiled';
import './style.scss';

import { UserMenu } from '@/widgets/UserMenu';
import { stringToElement } from '@/shared/utils';

export class UserSession {
    constructor(props) {
        this.props = props;

        this.handleGlobalClick = this.handleGlobalClick.bind(this);

        if (this.props.user) {
            this.menu = new UserMenu();
        }
    }

    initMenu() {
        document.removeEventListener('click', this.handleGlobalClick);

        this.element.querySelector('[data-slot="user-menu"]')
            .replaceWith(this.menu.render());

        document.addEventListener('click', this.handleGlobalClick);
    }

    handleGlobalClick(event) {
        const isClickInsideToggle = event.target.closest('.js-session-toggle');
        const isClickInsideMenu = event.target.closest('.js-user-menu');

        if (isClickInsideToggle) {
            this.menu.toggle();
        } else if (!isClickInsideMenu) {
            this.menu.hide();
        }
    }

    render() {
        this.element = stringToElement(template(this.props));
        if (this.menu) {
            this.initMenu();
        }

        return this.element;
    }

    destroy() {
        document.removeEventListener('click', this.handleGlobalClick);
    }
}
