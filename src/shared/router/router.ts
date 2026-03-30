import { appState } from '../config';
import { IPage } from '../model';

import { findMatch } from './findMatch';
import { Route } from '../config/router';
import { LandingPage } from '@/pages/LandingPage';

let pageInstance: IPage | null = null;

export const router = async (path = '/') => {
    const root = document.getElementById('root');
    if (!root) {
        return;
    }

    if (pageInstance) {
        pageInstance.destroy();
    }

    const route: Route | null = findMatch(path);

    if (!route) {
        // TODO add 404 Page
        pageInstance = new LandingPage(appState);
    } else {
        pageInstance = new route.view(appState);
    }

    root.innerHTML = '';
    root.appendChild(pageInstance.render());
};

export const navigate = async (path: string) => {
    appState.currentPath = path;
    window.history.pushState(appState, '', path);

    await router(path);
};

window.addEventListener('popstate', (event) => {
    const path = event.state?.currentPath || window.location.pathname;
    router(path);
});
