import template from './SessionActions.hbs?compiled';
import './style.scss';

import { stringToElement } from '@/shared/utils';

import { UserMenu } from '@/widgets/UserMenu';

export class SessionActions {
    constructor(props) {
        this.element = stringToElement(template(props));

        this.userMenu = new UserMenu({
            className: 'session-actions__user-menu'
        })

        this.element.querySelector('[data-slot="user-menu"]')
            .replaceWith(this.userMenu.render());

        this.initMenuListeners();
    }

    initMenuListeners() {
        document.addEventListener('click', async (event) => {
            const toggleButton = event.target.closest('.js-session-toggle');

            if (toggleButton) {
                this.userMenu.show();
            } else {
                this.userMenu.hide();
            }
        });
    }

    render() {
        return this.element;
    }
}
