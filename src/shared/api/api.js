const API_URL = 'http://localhost:8081/api';

const request = async (path, options) => {
    const url = `${API_URL}${path}`;

    const defaultOptions = {
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
        },
        ...options,
    };

    try {
        const response = await fetch(url, defaultOptions);

        if (response.status === 204 || response.headers.get('content-length') === '0') {
            return null;
        }

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Something went wrong');
        }

        return data;
    } catch (error) {
        console.error(`API Error (${path}):`, error.message);
        throw error;
    }
}

export const API = {
    login: (login, password) => {
        return request('/login', {
            method: 'POST',
            body: JSON.stringify({ login, password }),
        });
    },

    logout: () => {
        return request('/logout', {
            method: 'POST',
        });
    },

    getPlaces: () => {
        return request('/places', {
            method: 'GET',
        });
    }
};
