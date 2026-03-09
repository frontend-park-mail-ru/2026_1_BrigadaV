import { LandingPage } from '@/pages/LandingPage';
import { findMatch } from './findMatch';
import { appState } from '@/shared/config/router';

export const router = async (path = '/') => {
    const root = document.getElementById('root');

    const view = findMatch(path) || LandingPage;

    root.innerHTML = '';
    root.appendChild(await view(appState));
}

window.addEventListener('popstate', (event) => router(event.state.currentPath));
