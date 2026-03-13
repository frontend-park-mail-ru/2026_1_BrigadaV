import { config } from '@/shared/config/router.js';

export const findMatch = (path) => {
    for (const page of Object.values(config)) {
        if (path === page.href) {
            return page.view;
        }
    }

    return null;
};
