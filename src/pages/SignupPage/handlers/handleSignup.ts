import { mapUser } from '@/entities/User';
import { API, ApiError } from '@/shared/api';
import { appState } from '@/shared/config';
import { navigate } from '@/shared/router';
import { validateEmail, validatePassword } from '@/shared/utils';
import { AuthForm } from '@/widgets/AuthForm';

import { SignUpFormData } from '../model/types';

export const handleSubmit = async (instance: AuthForm, data: FormData) => {
    const rawData = Object.fromEntries(data) as SignUpFormData;
    const { nickname, login, password, 'password-repeat': passwordRepeat} = rawData;

    if (!validateEmail(login)) {
        instance.setFieldError('login', 'Некорректный формат email');
        return;
    }

    if (!validatePassword(password)) {
        instance.setFieldError('password', 'Некорректный формат пароля');
        return;
    }

    if (password !== passwordRepeat) {
        instance.setFieldError('password-repeat', 'Пароли не совпадают');
        return;
    }

    try {
        const result = mapUser(await API.register(nickname, login, password));

        appState.currentUser = result;
        navigate('/');

    } catch (error) {
        if (!(error instanceof ApiError) || !error.field) {
            return;
        }

        instance.setFieldError(error.field, error.message);
    }
};
