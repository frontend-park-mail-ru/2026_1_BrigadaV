import { router } from '@/shared/router/router.js';
import { appState } from '@/shared/config/router.js';

document.addEventListener('DOMContentLoaded', () => {
    document.addEventListener('click', (event) => {
        if (event.target.closest('[data-link]')) {
            event.preventDefault();

            appState.currentPath = new URL(event.target.href).pathname;

            window.history.pushState(appState, '', appState.currentPath);
            router(appState);
        }
    })

    router(appState);
})
