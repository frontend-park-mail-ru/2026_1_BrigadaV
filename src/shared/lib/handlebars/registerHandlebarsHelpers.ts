import Handlebars from 'handlebars';

import { config } from '@/shared/config';

export const registerHandlebarsHelpers = () => {
    Handlebars.registerHelper('s', function (this: { styles?: Record<string, string> }, className: string): string {
        return this.styles?.[className] || className;
    });

    Handlebars.registerHelper('eq', function (a: unknown, b: unknown): boolean {
        return a === b;
    });

    Handlebars.registerHelper('url', function (...segments: unknown[]): string {
        segments = segments.slice(0, -1) as string[];

        const path = segments.join('/');

        for (const { hrefRegex } of Object.values(config)) {
            if (path.match(hrefRegex)) {
                return path;
            }
        }

        return '#';
    });
};
