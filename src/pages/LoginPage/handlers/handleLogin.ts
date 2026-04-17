import { mapUserAuth } from '@/entities/User';
import { API, ApiError } from '@/shared/api';
import { appState } from '@/shared/config';
import { navigate } from '@/shared/router';
import { AuthForm } from '@/widgets/AuthForm';

import { LoginFormData } from '../model/types';
import { Toast } from '@/shared/ui/Toast';

export const handleSubmit = async (instance: AuthForm, data: FormData) => {
    const rawData = Object.fromEntries(data) as LoginFormData;

    const { login, password } = rawData;

    try {
        const result = mapUserAuth(await API.login(login, password));
        appState.currentUser = result;
        navigate('/');

    } catch (error) {
        if (!(error instanceof ApiError) || error.error === 'SERVER_ERROR') {
            Toast({message: 'Наблюдаются проблемы со входом. Попробуйте зайти позже'})
        }

        instance.setFieldError('password', 'Введен неверный логин или пароль');
    }
};
