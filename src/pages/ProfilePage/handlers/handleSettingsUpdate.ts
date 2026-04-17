import { SettingsModal } from "@/widgets/SettingsModal";
import { SettingsModalFormData } from "../model/types";
import { eventBus, validateEmail, validatePassword } from "@/shared/lib";
import { API } from "@/shared/api";
import { User } from "@/entities/User";

export const handleSubmit = async (instance: SettingsModal, data: FormData, user: User): Promise<void> => {
    const rawData = Object.fromEntries(data) as SettingsModalFormData;
    const { avatar, nickname, login, password, 'password-repeat': passwordRepeat, city, about } = rawData;

    const patch = {};

    if (user.nickname !== nickname) {
        patch.nickname = nickname;
    }

    if (user.city !== city) {
        patch.city = city;
    }

    if (user.about !== about) {
        patch.about = about;
    }

    if (Object.keys(patch).length === 0) {
        instance.close();
        return;
    }

    try {
        const result = await API.updateUser(patch);
        if (result) {
            instance.close();
            eventBus.emit('user:update', { nickname, city, about })
        }
    } catch {
    }
};
