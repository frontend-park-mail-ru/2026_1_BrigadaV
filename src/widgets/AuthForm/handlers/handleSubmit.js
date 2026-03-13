import { validateEmail } from '@/shared/utils';
import { API } from '@/shared/api/api';
import { appState } from '@/shared/config/router';
import { navigate } from '@/shared/router/router';

export const handleSubmit = async (instance, event) => {
    event.preventDefault();

    instance.clearErrors();

    const formData = new FormData(event.target);
    const { login, password } = Object.fromEntries(formData);

    if (!validateEmail(login)) {
        instance.loginField.setError('Некорректный формат email');
        return;
    }

    try {
        const result = await API.login(login, password);
        appState.currentUser = result;
        navigate('/');

    } catch {
        instance.passwordField.setError('Введен неверный логин или пароль');
    }
};
