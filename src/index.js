import { appState } from '@/shared/config/router.js';
import { navigate } from '@/shared/router/router';
import { API } from '@/shared/api/api';

document.addEventListener('DOMContentLoaded', async () => {
    document.addEventListener('click', (event) => {
        const link = event.target.closest('[data-link]');

        if (link) {
            event.preventDefault();

            const path = new URL(link.href).pathname;
            navigate(path);
        }
    })

    try {
        const user = await API.me();
        appState.currentUser = user;
    } catch (error) {
        appState.currentUser = null;
    }

    navigate('/');
})
