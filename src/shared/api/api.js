/**
 * URL для всех API запросов
 * @constant {string}
 * @default 'http://212.233.96.48:8080/api'
 */
const API_URL = 'http://212.233.96.48:8080/api';

/**
 * Метод для выполнения API запросов
 * 
 * @async
 * @private
 * @param {string} path - Путь к эндпоинту
 * @param {RequestInit} [options] - Дополнительные опции для fetch
 * @returns {Promise<any>} - Данные ответа от сервера
 */
const request = async (path, options) => {
    const url = `${API_URL}${path}`;

    const defaultOptions = {
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
};

/**
 * Объект с методами для взаимодействия с API
 * @namespace API
 */
export const API = {
    /**
     * Регистрация нового пользователя
     * 
     * @async
     * @memberof API
     * @param {string} name - Отображаемое имя (никнейм) пользователя
     * @param {string} login - Email пользователя (используется для входа)
     * @param {string} password - Пароль (минимум 8 символов)
     * @returns {Promise<UserData>} - Данные созданного пользователя
     * @throws {ApiError} - В случае ошибки валидации или конфликта
     */
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

    /**
     * Вход в систему
     * 
     * @async
     * @memberof API
     * @param {string} login - Email пользователя
     * @param {string} password - Пароль
     * @returns {Promise<UserData>} - Данные авторизованного пользователя
     * @throws {ApiError} - В случае неверных учетных данных
     */
    login: async (login, password) => {
        return request('/login', {
            method: 'POST',
            body: JSON.stringify({ login, password }),
        });
    },
    /**
     * Получение информации о текущем пользователе
     * 
     * @async
     * @memberof API
     * @returns {Promise<UserData>} - Данные текущего пользователя
     * @throws {ApiError} - Если пользователь не авторизован (статус 401)
     */
    me: async () => {
        return request('/user/me', {
            method: 'GET'
        });
    },

    /**
     * Выход из системы
     * 
     * @async
     * @memberof API
     * @returns {Promise<{message: string}>} - Подтверждение выхода
     * @throws {ApiError} - В случае ошибки при выходе
     */
    logout: async () => {
        return request('/logout', {
            method: 'POST',
        });
    },

    /**
     * Получение списка мест
     * 
     * @async
     * @memberof API
     * @returns {Promise<PlaceData[]>} - Массив мест с информацией о лайках
     * @throws {ApiError} - Если пользователь не авторизован или другая ошибка
    */
    getPlaces: async () => {
        return request('/', {
            method: 'GET',
        });
    }
};

