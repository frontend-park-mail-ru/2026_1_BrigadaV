import { LandingPage } from '@/pages/LandingPage';
import { appState } from '../config';
import { IPage, PageConstructor } from '../model';

import { findMatch } from './findMatch';

let pageInstance: IPage | null = null;

export const router = async (path = '/') => {
    const root = document.getElementById('root');
    if (!root) {
        return;
    }

    if (pageInstance) {
        pageInstance.destroy();
    }

    const ViewClass: PageConstructor = findMatch(path) || LandingPage;
    pageInstance = new ViewClass(appState);

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
