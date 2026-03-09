import { API } from '@/shared/api/api';
import { navigate } from '@/shared/router/router';

export const handleLogin = async (event, appState) => {
    event.preventDefault();

    const form = event.target;
    const data = Object.fromEntries(new FormData(form));

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(data.login)) {
        // TODO Сделать вывод ошибок в поля
        // console.error('Invalid email format');
        return;
    }

    try {
        const result = await API.login(data.login, data.password);
        appState.currentUser = result;
        navigate('/');

    } catch (error) {
        // TODO Сделать вывод ошибок в поля
        // console.error('Network error during login:', error);
    }
};
