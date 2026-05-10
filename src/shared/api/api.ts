import { ApiResponse, ErrorDTO } from './types';

export const API_PATH = '/api';

let cachedCSRFToken: string | null = null;

const getCSRFToken = async (): Promise<string> => {
    if (cachedCSRFToken) return cachedCSRFToken;

    try {
        let response = await fetch(`${API_PATH}/csrf-token`, { credentials: 'include' });
        if (!response.ok && cachedCSRFToken) {
            cachedCSRFToken = null;
            response = await fetch(`${API_PATH}/csrf-token`, { credentials: 'include' });
        }

        const data = await response.json();
        cachedCSRFToken = data.csrf_token;
        return cachedCSRFToken || '';
    } catch { }

    return '';
};

export const request = async <T = unknown>(
    path: string,
    options: RequestInit
): Promise<ApiResponse<T>> => {
    const url = `${API_PATH}${path}`;
    const method = options.method?.toUpperCase() ?? 'GET';
    const needCSRF = ['POST', 'PUT', 'DELETE', 'PATCH'].includes(method);

    const headers: HeadersInit = {
        'Content-Type': 'application/json',
        ...(needCSRF ? { 'X-CSRF-Token': await getCSRFToken() } : {}),
    };

    if (options.body instanceof FormData) {
        delete headers['Content-Type'];
    }

    try {
        const response = await fetch(url, {
            credentials: 'include',
            ...options,
            headers: {
                ...headers,
                ...options.headers
            },
        });

        if (!response.ok) {
            let errorMessage = 'Произошла непредвиденная ошибка';
            try {
                const errorData = await response.json() as ErrorDTO;
                errorMessage = errorData.message || errorData.error || errorMessage;
            } catch { }

            return {
                ok: false,
                error: errorMessage,
                status: response.status
            };
        }

        if (response.status === 204 || response.headers.get('content-length') === '0') {
            return {
                ok: true,
                data: null as T,
                status: response.status
            };
        }

        const data = await response.json() as T;
        return {
            ok: true,
            data,
            status: response.status
        };

    } catch (error) {
        return {
            ok: false,
            error: error instanceof Error ? error.message : 'Ошибка соединения',
            status: 0
        };
    }
};
