import template from './UserSession.hbs?compiled';
import './style.scss';

import { User } from '@/entities/User';
import { UserMenu } from '@/widgets/UserMenu';
import { AuthLinks } from '@/features/AuthLinks';
import { AuthPrompt } from '@/features/AuthPrompt';
import { stringToElement } from '@/shared/utils';

export class UserSession {
    constructor(props) {
        this.props = props;
        this.element = stringToElement(template(props));
        this.contentSlot = this.element.querySelector('[data-slot="session-content"]');

        this.handleGlobalClick = this.handleGlobalClick.bind(this);

        this.renderState();
    }

    renderState() {
        const { user, authPrompt } = this.props;

        if (user) {
            this.renderAuthenticated(user);
        } else if (authPrompt) {
            this.renderPrompt(authPrompt);
        } else {
            this.renderGuest();
        }
    }

    renderAuthenticated(user) {
        const avatar = new User({
            user,
            className: 'js-session-toggle'
        });

        const menu = new UserMenu({ user });
        const contentWrapper = document.createElement('div');

        contentWrapper.appendChild(avatar.render());
        contentWrapper.appendChild(menu.render());

        this.avatar = avatar;
        this.menu = menu;

        this.contentSlot.replaceWith(contentWrapper);

        document.addEventListener('click', (event) => this.handleGlobalClick(event, this));
    }

    renderPrompt(authPrompt) {
        const promptFeature = new AuthPrompt(authPrompt);
        this.contentSlot.replaceWith(promptFeature.render());
    }

    renderGuest() {
        const guestLinks = new AuthLinks();
        this.contentSlot.replaceWith(guestLinks.render());
    }

    handleGlobalClick(event, instance) {
        if (!instance.menu) return;

        const isClickInsideToggle = event.target.closest('.js-session-toggle');
        const isClickInsideMenu = instance.menu.render().contains(event.target);

        if (isClickInsideToggle) {
            instance.menu.toggle();
        } else if (!isClickInsideMenu) {
            instance.menu.hide();
        }
    }

    render() {
        return this.element;
    }
}
