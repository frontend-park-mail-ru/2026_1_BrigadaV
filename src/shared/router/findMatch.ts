import { config } from '../config';
import { Route } from '../config/router';

export const findMatch = (path: string): Route | null => {
    for (const page of Object.values(config)) {
        if (path === page.href) {
            return page;
        }
    }

    return null;
};
