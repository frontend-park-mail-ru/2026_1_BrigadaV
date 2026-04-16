import { config } from '../config';
import { Match } from './router';

export const findMatch = (path: string): Match | null => {
    for (const page of Object.values(config)) {
        const match = path.match(page.hrefRegex);
        if (match) {

            return {
                page,
                parameters: Object.entries(match.groups || {}).reduce((acc, [param, value]) => {
                    acc[param] = /^[0-9]+$/.test(value) ? +value : value;
                    return acc;
                }, {} as Record<string, string | number>),
            };
        }
    }

    return null;
};
