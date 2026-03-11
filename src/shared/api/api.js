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
            const error = new Error(data.message || 'Something went wrong');

            error.field = data.field;
            error.errorCode = data.error;

            throw error;
        }

        return data;
    } catch (error) {
        // TODO Сделать вывод ошибок тост сообщением
        throw error;
    }
}

export const API = {
    register: async (name, login, password) => {
        return request('/register', {
            method: 'POST',
            body: JSON.stringify({
                login: login,
                password: password,
                nickname: name
            })
        });
    },

    login: async (login, password) => {
        return request('/login', {
            method: 'POST',
            body: JSON.stringify({ login, password }),
        });
    },

    me: async () => {
        return request('/user/me', {
            method: 'GET'
        })
    },

    logout: async () => {
        return request('/logout', {
            method: 'POST',
        });
    },

    getPlaces: async () => {
        return request('/places', {
            method: 'GET',
        });
    }
};
