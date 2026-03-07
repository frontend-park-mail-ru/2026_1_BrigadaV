import { router } from '@/shared/router/router.js';

document.addEventListener('DOMContentLoaded', () => {
    document.addEventListener('click', (e) => {
        if (e.target.closest('[data-link]')) {
            e.preventDefault();
            window.history.pushState(null, '', e.target.href);
            router();
        }
    })

    router();
})
