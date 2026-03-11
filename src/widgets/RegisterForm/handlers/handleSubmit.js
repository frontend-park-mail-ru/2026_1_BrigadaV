import { validateEmail } from '../lib/validateEmail';
import { API } from '@/shared/api/api';
import { appState } from '@/shared/config/router';
import { navigate } from '@/shared/router/router';

export const handleSubmit = async (instance, event) => {
    event.preventDefault();

    instance.clearErrors();

    const formData = new FormData(event.target);

    const { nickname, login, password, 'password-repeat': passwordRepeat } = Object.fromEntries(formData);

    if (!validateEmail(login)) {
        instance.loginField.setError('Некорректный формат email');
        return
    }

    if (password !== passwordRepeat) {
        instance.passwordRepeatField.setError('Пароли не совпадают');
        return
    }

    try {
        const result = await API.register(nickname, login, password);

        appState.currentUser = result;
        navigate('/');

    } catch (error) {
        instance.fieldMap[error.field].setError(error.message);
    }
}
