import { mapUserAuth } from '@/entities/User';
import { API, ApiError } from '@/shared/api';
import { appState } from '@/shared/config';
import { navigate } from '@/shared/router';
import { validateEmail, validatePassword } from '@/shared/lib';
import { AuthForm } from '@/widgets/AuthForm';

import { SignUpFormData } from '../model/types';
import { Toast } from '@/shared/ui/Toast';

export const handleSubmit = async (instance: AuthForm, data: FormData) => {
    const rawData = Object.fromEntries(data) as SignUpFormData;
    const { nickname, login, password, 'password-repeat': passwordRepeat } = rawData;

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
        const result = mapUserAuth(await API.register(nickname, login, password));

        appState.currentUser = {
            id: result.id,
            login,
            nickname,
        };

        navigate('/');

    } catch (error) {
        if (!(error instanceof ApiError)) return;

        switch (error.error) {
            case 'nickname already exists':
                instance.setFieldError('nickname', 'Имя уже занято');
                break;
            case 'email already exists':
                instance.setFieldError('login', 'Почта уже зарегистрирована');
                break;

            default:
                Toast({
                    message: 'Произошла непредвиденная ошибка. Пожалуйста, повторите попытку позже.',
                    type: 'error',
                })
        }
    }
};
