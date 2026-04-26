import { loginUser } from '@/entities/User';
import { ApiError } from '@/shared/api';
import { appState } from '@/shared/config';
import { navigate } from '@/shared/router';
import { Toast } from '@/shared/ui/Toast';
import { AuthForm } from '@/widgets/AuthForm';

import { LoginPayload } from '../model/types';

export const handleLogin = async ({ instance, data }: { instance: AuthForm, data: LoginPayload }) => {
    try {
        const result = await loginUser(data);
        appState.currentUser = result;
        navigate('/');

    } catch (error) {
        if (!(error instanceof ApiError) || error.error === 'SERVER_ERROR') {
            Toast({ message: 'Наблюдаются проблемы со входом. Попробуйте зайти позже' });
        }

        instance.setFieldError('password', 'Введен неверный логин или пароль');
    }
};
