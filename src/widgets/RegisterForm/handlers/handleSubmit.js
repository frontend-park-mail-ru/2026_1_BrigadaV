import { validateEmail } from '@/shared/utils';
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
        return;
    }

    if (password !== passwordRepeat) {
        instance.passwordRepeatField.setError('Пароли не совпадают');
        return;
    }

    try {
        const result = await API.register(nickname, login, password);

        appState.currentUser = result;
        navigate('/');

    } catch (error) {
        switch (error.errorCode) {
        case 'LOGIN_ALREADY_EXISTS':
            instance.loginField.setError('Логин уже существует');
            break;

        case 'NICKNAME_ALREADY_EXISTS':
            instance.nicknameField.setError('Никнейм уже занят');
            break;

        case 'VALIDATION_ERROR':
            instance.fieldMap[error.field].setError(error.message);
            break;

        default:
            instance.passwordRepeatField.setError('Произошла непредвиденная ошибка. Попробуйте ещё раз');
        }
    }
};
