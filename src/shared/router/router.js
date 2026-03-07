import { LandingPage } from '@/pages/LandingPage';
import { findMatch } from './findMatch';

export const router = () => {
    const root = document.getElementById('root');
    const path = window.location.pathname;

    const view = findMatch(path) || LandingPage;

    root.innerHTML = '';
    root.appendChild(view());
}

window.addEventListener('popstate', router);
