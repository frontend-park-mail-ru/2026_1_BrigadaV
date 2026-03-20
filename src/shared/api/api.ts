import { ApiError } from './lib/ApiError';
import { LoginDTO, PlaceDTO, RegisterDTO } from './types';

const API_URL = import.meta.env.DEV ? 'http://localhost:8081/api' : 'http://212.233.96.48:8080/api';

const request = async (path: string, options: RequestInit) => {
    const url = `${API_URL}${path}`;

    const defaultOptions: RequestInit = {
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
        },
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

        return data;
    } catch (error) {
        // TODO Сделать вывод ошибок тост сообщением
        throw error;
    }
};

export const API = {
    register: async (name: string, login: string, password: string): Promise<RegisterDTO> => {
        return request('/register', {
            method: 'POST',
            body: JSON.stringify({
                login,
                password,
                nickname: name
            })
        });
    },

    login: async (login: string, password: string): Promise<LoginDTO> => {
        return request('/login', {
            method: 'POST',
            body: JSON.stringify({ login, password }),
        });
    },

    me: async (): Promise<LoginDTO> => {
        return request('/user/me', {
            method: 'GET'
        });
    },

    logout: async (): Promise<void> => {
        return request('/logout', {
            method: 'POST',
        });
    },

    getPlaces: async (): Promise<PlaceDTO[]> => {
        return request('/', {
            method: 'GET',
        });
    }
};
