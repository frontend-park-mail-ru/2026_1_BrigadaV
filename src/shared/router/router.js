import { LandingPage } from '@/pages/LandingPage';
import { findMatch } from './findMatch';

export const router = (appState) => {
    const root = document.getElementById('root');

    const view = findMatch(appState.currentPath) || LandingPage;

    root.innerHTML = '';
    root.appendChild(view(appState));
}

window.addEventListener('popstate', (event) => router(event.state));
