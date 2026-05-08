import { UpdateRequest, updateUser, uploadAvatar, User } from '@/entities/User';
import { eventBus, validateAvatar, validateEmail, validateNickname } from '@/shared/lib';
import { resolveStaticPath } from '@/shared/utils';
import { SettingsModal } from '@/widgets/SettingsModal';
import { SettingsModalPayload } from '@/widgets/SettingsModal/model/types';

export const handleSettingsUpdate = async ({ instance, data, user }: { instance: SettingsModal, data: SettingsModalPayload, user: User }): Promise<void> => {
    const { avatar, nickname, login, city, about } = data;

    const rules = [
        {
            isInvalid: avatar.size && !validateAvatar(avatar),
            field: 'avatar',
            message: 'Аватар должен быть изображением меньше 10Мб',
        },
        {
            isInvalid: nickname && !validateNickname(nickname),
            field: 'nickname',
            message: 'Ник должен быть длиной от 3 до 50 символов',
        },
        {
            // TODO wait for backend to update their API to return user login
            isInvalid: login && !validateEmail(login),
            field: 'login',
            message: 'Некорректный формат email',
        },
    ];

    const failures = rules.filter(rule => rule.isInvalid);

    if (failures.length > 0) {
        failures.forEach(({ field, message }) => instance.setFieldError(field, message));
        return;
    }

    const patch = {} as UpdateRequest;
    if (user.nickname !== nickname) patch.nickname = nickname;
    // if (user.login !== login) patch.login = login;
    if (user.city !== city) patch.city = city;
    if (user.about !== about) patch.about = about;


    const avatarUpdate = avatar.size ? uploadAvatar(avatar) : Promise.resolve(null);
    const userUpdate = Object.keys(patch).length > 0 ? updateUser(patch) : Promise.resolve(null);

    const [avatarRes, userRes] = await Promise.all([avatarUpdate, userUpdate]);

    const update = {
        ...(avatarRes?.ok && { avatar: resolveStaticPath(avatarRes.data) }),
        ...(userRes?.ok && userRes.data)
    };

    if (Object.keys(update).length > 0) {
        instance.close();
        eventBus.emit('user:update', update);
    }
};
