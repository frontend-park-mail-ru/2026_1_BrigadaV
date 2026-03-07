import { LandingPage } from '@/pages/LandingPage';
import { findMatch } from './findMatch';
import { appState } from '@/shared/config/router';

export const router = (path = '/') => {
    const root = document.getElementById('root');

    const view = findMatch(path) || LandingPage;

    root.innerHTML = '';
    root.appendChild(view(appState));
}

window.addEventListener('popstate', (event) => router(event.state.currentPath));
