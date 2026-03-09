import { appState } from '@/shared/config/router.js';
import { navigate } from '@/shared/router/router';

document.addEventListener('DOMContentLoaded', () => {
    document.addEventListener('click', (event) => {
        const link = event.target.closest('[data-link]');

        if (link) {
            event.preventDefault();

            const path = new URL(link.href).pathname;
            navigate(path);
        }
    })

    navigate('/');
})
