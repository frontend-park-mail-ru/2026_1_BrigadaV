import template from './SessionActions.hbs?compiled';
import './style.scss';

import { appState } from '@/shared/config/router';
import { API } from '@/shared/api/api';
import { navigate } from '@/shared/router/router';

document.addEventListener('click', async (event) => {
    const toggleButton = event.target.closest('.js-session-toggle');
    const logoutButton = event.target.closest('.js-logout');
    const menu = document.querySelector('.js-session-menu');

    if (toggleButton) {
        menu?.classList.toggle('session-menu--active');
        return;
    }

    if (logoutButton) {
        appState.currentUser = null;
        await API.logout();

        navigate(window.location.pathname);
        return;
    }

    if (menu && !event.target.closest('.session-actions__container')) {
        menu.classList.remove('session-menu--active');
    }
});

export const SessionActions = (props) => {
    return template(props);
}
