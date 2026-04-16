import { SettingsModal } from "@/widgets/SettingsModal";
import { SettingsModalFormData } from "../model/types";
import { eventBus, validateEmail, validatePassword } from "@/shared/lib";
import { API } from "@/shared/api";

export const handleSubmit = async (instance: SettingsModal, data: FormData): Promise<void> => {
    const rawData = Object.fromEntries(data) as SettingsModalFormData;
    const { avatar, nickname, login, password, 'password-repeat': passwordRepeat, city, about } = rawData;

    if (login && !validateEmail(login)) {
        instance.setFieldError('login', 'Некорректный формат email');
        return;
    }

    if (password && !validatePassword(password)) {
        instance.setFieldError('password', 'Некорректный формат пароля');
        return;
    }

    if (password !== passwordRepeat) {
        instance.setFieldError('password-repeat', 'Пароли не совпадают');
        return;
    }

    try {
        const result = await API.updateUser(nickname, '', city, about);
        if (result) {
            instance.close();
            console.log('here');
            eventBus.emit('user:update', { nickname, city, about })
        }
    } catch {
    }
};
