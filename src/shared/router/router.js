import { LandingPage } from '@/pages/LandingPage';
import { findMatch } from './findMatch';
import { appState } from '@/shared/config/router';

export const router = async (path = '/') => {
    const root = document.getElementById('root');

    const view = findMatch(path) || LandingPage;

    root.innerHTML = '';
    root.appendChild(await view(appState));
}

export const navigate = async (path) => {
    appState.currentPath = path;
    window.history.pushState(appState, '', path);

    await router(path);
}

window.addEventListener('popstate', (event) => {
    const path = event.state?.currentPath || window.location.pathname;
    router(path);
});
