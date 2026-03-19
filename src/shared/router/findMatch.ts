import { config } from '../config';
import { PageConstructor } from '../model';

export const findMatch = (path: string): PageConstructor | null => {
    for (const page of Object.values(config)) {
        if (path === page.href) {
            return page.view;
        }
    }

    return null;
};
