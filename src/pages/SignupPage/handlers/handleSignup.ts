import { registerUser } from '@/entities/User';
import { ApiError } from '@/shared/api';
import { appState } from '@/shared/config';
import { validateEmail, validateNickname, validatePassword } from '@/shared/lib';
import { navigate } from '@/shared/router';
import { Toast } from '@/shared/ui/Toast';
import { AuthForm } from '@/widgets/AuthForm';

import { SignUpPayload } from '../model/types';

export const handleSignup = async ({ instance, data }: { instance: AuthForm, data: SignUpPayload }) => {
    const { nickname, login, password, 'password-repeat': passwordRepeat } = data;


    if (!validateNickname(nickname)) {
        instance.setFieldError('nickname', 'Ник должен быть длиной от 3 до 50 символов');
        return;
    }

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
        const result = await registerUser(data);

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
        case 'login already exists':
            instance.setFieldError('login', 'Почта уже зарегистрирована');
            break;

        default:
            Toast({
                message: 'Произошла непредвиденная ошибка. Пожалуйста, повторите попытку позже.',
                type: 'error',
            });
        }
    }
};
