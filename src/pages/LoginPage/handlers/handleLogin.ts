import { mapUser } from '@/entities/User';
import { API, ApiError } from '@/shared/api';
import { appState } from '@/shared/config';
import { navigate } from '@/shared/router';
import { validateEmail } from '@/shared/utils';
import { AuthForm } from '@/widgets/AuthForm';

import { LoginFormData } from '../model/types';

export const handleSubmit = async (instance: AuthForm, data: FormData) => {
    const rawData = Object.fromEntries(data) as LoginFormData;

    const { login, password } = rawData;

    if (!validateEmail(login)) {
        instance.setFieldError('login', 'Некорректный формат email');
        return;
    }

    try {
        const result = mapUser(await API.login(login, password));
        appState.currentUser = result;
        navigate('/');

    } catch (error) {
        if (!(error instanceof ApiError) || error.error === 'SERVER_ERROR') {
            instance.setFieldError('password', 'Наблюдаются проблемы со входом. Попробуйте зайти позже')
        }

        instance.setFieldError('password', 'Введен неверный логин или пароль');
    }
};
