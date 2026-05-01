import { BACKEND_ORIGIN } from '@/shared/api/api';

export const resolveStaticPath = (path?: string) => {
    if (!path) return '';
    if (path.startsWith('http')) return path;

    const normalizedPath = path.startsWith('/') ? path : `/${path}`;
    return `${BACKEND_ORIGIN}${normalizedPath}`;
};
