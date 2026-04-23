import { ApiError } from './lib/ApiError';

const API_URL = import.meta.env.DEV ? 'http://localhost:8080/api' : 'http://guidely.ru:8080/api';

let cachedCSRFToken: string | null = null;

const getCSRFToken = async (): Promise<string> => {

    if (cachedCSRFToken) return cachedCSRFToken;

    try {
        let response = await fetch(`${API_URL}/csrf-token`, { credentials: 'include' });
        if (!response.ok && cachedCSRFToken) {
            cachedCSRFToken = null;
            response = await fetch(`${API_URL}/csrf-token`, { credentials: 'include' });
        }

        const data = await response.json();
        cachedCSRFToken = data.csrf_token;
        return cachedCSRFToken || '';
    } catch (error) {
        console.error(error);
    }
    return '';
};

export const request = async <T = unknown>(path: string, options: RequestInit) => {
    const url = `${API_URL}${path}`;
    // const needCSRF = ['POST', 'PUT', 'DELETE', 'PATCH'].includes(method);

    const headers: HeadersInit = {
        'Content-Type': 'application/json',
        // ...(needCSRF ? { 'X-CSRF-Token': await getCSRFToken() } : {}),
    };

    const method = options.method?.toUpperCase() ?? 'GET';

    if (options.body instanceof FormData) {
        delete headers['Content-Type'];
    }

    const defaultOptions: RequestInit = {
        credentials: 'include',
        headers,
        ...options,
    };

    // eslint-disable-next-line no-useless-catch
    try {
        const response = await fetch(url, defaultOptions);

        if (response.status === 204 || response.headers.get('content-length') === '0') {
            return null;
        }

        const data = await response.json();

        if (!response.ok) {
            const error = new ApiError(data);
            throw error;
        }

        return data as T;
    } catch (error) {
        // TODO Сделать вывод ошибок тост сообщением
        throw error;
    }
};
