import { LandingPage } from '@/pages/LandingPage';

import { appState } from '../config';
import { Route } from '../config/router';
import { IPage } from '../model';
import { findMatch } from './findMatch';

export type Match = {
    page: Route;
    parameters: Record<string, string | number>;
}

let pageInstance: IPage | null = null;

export const router = async (path = '/') => {
    const root = document.getElementById('root');
    if (!root) {
        return;
    }

    if (pageInstance) {
        pageInstance.destroy();
    }

    const match: Match | null = findMatch(path);

    let redirectPath: string | null = null;

    if (!match) {
        // TODO add 404 page
        pageInstance = await LandingPage.create(appState);
        redirectPath = '/';

    } else {
        const isAuthRequired = match.page.authOnly && !appState.currentUser;
        const isGuestOnly = match.page.guestOnly && appState.currentUser;

        if (isAuthRequired || isGuestOnly) {
            pageInstance = await LandingPage.create(appState);
            redirectPath = '/';
        } else {
            pageInstance = await match.page.view.create(appState, match.parameters);
        }
    }

    if (redirectPath && path !== redirectPath) {
        appState.currentPath = redirectPath;
        window.history.replaceState(appState, '', redirectPath);
    }

    if (pageInstance) {
        root.innerHTML = '';
        root.appendChild(pageInstance.render());
    }
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
