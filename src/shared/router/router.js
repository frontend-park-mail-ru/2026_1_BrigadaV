import { LandingPage } from '@/pages/LandingPage';
import { findMatch } from './findMatch';
import { appState } from '@/shared/config/router';

let pageInstance = null;

export const router = async (path = '/') => {
    const root = document.getElementById('root');

    if (pageInstance) {
        pageInstance.destroy();
    }

    const ViewClass = findMatch(path) || LandingPage;
    pageInstance = new ViewClass(appState);

    root.innerHTML = '';
    root.appendChild(pageInstance.render());
};

export const navigate = async (path) => {
    appState.currentPath = path;
    window.history.pushState(appState, '', path);

    await router(path);
};

window.addEventListener('popstate', (event) => {
    const path = event.state?.currentPath || window.location.pathname;
    router(path);
});
