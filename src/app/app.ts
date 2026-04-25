import './styles/_base.scss';
import './styles/_reset.scss';
import './styles/_typography.scss';

import { authMe } from '@/entities/User';
import { appState } from '@/shared/config';
import { registerHandlebarsHelpers } from '@/shared/lib';
import { navigate } from '@/shared/router';

import { SupportWidget } from '@/widgets/SupportWidget';

export const App = async () => {
    registerHandlebarsHelpers();

    try {
        const user = await authMe();
        appState.currentUser = user;
    } catch {
        // TODO check status code and show popup if no connection
        appState.currentUser = null;
    }

    document.addEventListener('click', (event) => {
        const target = event.target;
        if (!(target instanceof HTMLElement)) return;

        const link = target.closest('[data-link]') as HTMLAnchorElement;

        if (link) {
            event.preventDefault();

            const path = new URL(link.href).pathname;
            navigate(path);
        }
    });

    if (!document.getElementById('support-widget-root')) {
        const supportWidget = new SupportWidget({ supportUrl: '/support' });
        // Временный контейнер для вставки
        const container = document.createElement('div');
        container.id = 'support-widget-root';
        document.body.appendChild(container);
        supportWidget.mountTo(container);
    }

// Если нужно передать ID пользователя, после авторизации:
// supportModel.show(userId);

    navigate(window.location.pathname);
};
