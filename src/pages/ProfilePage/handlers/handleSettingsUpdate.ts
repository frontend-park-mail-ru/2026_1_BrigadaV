import { UpdateRequest, updateUser, uploadAvatar, User } from '@/entities/User';
import { eventBus } from '@/shared/lib';
import { SettingsModal } from '@/widgets/SettingsModal';
import { SettingsModalPayload } from '@/widgets/SettingsModal/model/types';

export const handleSettingsUpdate = async ({ instance, data, user }: { instance: SettingsModal, data: SettingsModalPayload, user: User }): Promise<void> => {
    const { avatar, nickname, login, city, about } = data;

    const patch = {} as UpdateRequest;
    if (user.nickname !== nickname) patch.nickname = nickname;
    // if (user.login !== login) patch.login = login;
    if (user.city !== city) patch.city = city;
    if (user.about !== about) patch.about = about;


    const avatarUpdate = avatar.size ? uploadAvatar(avatar) : Promise.resolve(null);
    const userUpdate = Object.keys(patch).length > 0 ? updateUser(patch) : Promise.resolve(null);

    const [avatarRes, userRes] = await Promise.all([avatarUpdate, userUpdate]);

    const update = {
        ...(avatarRes?.ok && { avatar: avatarRes.data }),
        ...(userRes?.ok && userRes.data)
    };

    if (Object.keys(update).length > 0) {
        instance.close();
        eventBus.emit('user:update', update);
    }
};
