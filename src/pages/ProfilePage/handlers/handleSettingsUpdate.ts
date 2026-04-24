import { UpdateRequest, updateUser, uploadAvatar, User } from '@/entities/User';
import { eventBus, validateAvatar, validateNickname } from '@/shared/lib';
import { resolveStaticPath } from '@/shared/utils';
import { SettingsModal } from '@/widgets/SettingsModal';
import { SettingsModalPayload } from '@/widgets/SettingsModal/model/types';

export const handleSettingsUpdate = async ({ instance, data, user }: { instance: SettingsModal, data: SettingsModalPayload, user: User }): Promise<void> => {
    const { avatar, nickname, login, city, about } = data;

    if (nickname && !validateNickname(nickname)) {
        instance.setFieldError('nickname', 'Ник должен быть длиной от 3 до 50 символов');
        return;
    }

    // TODO wait for backend to update their API to return user login
    // if (login && !validateEmail(login)) {
    //     instance.setFieldError('login', 'Некорректный формат email');
    //     return;
    // }

    if (avatar?.size && !validateAvatar(avatar)) {
        // TODO Toast the error
        return;
    }

    let avatarPromise: Promise<string | void> = Promise.resolve();
    const patch = {} as UpdateRequest;

    if (avatar?.size) {
        avatarPromise = uploadAvatar(avatar);
    }
    console.log(user);
    console.log(data);

    if (user.nickname !== nickname) patch.nickname = nickname;
    // if (user.login !== login) patch.login = login;
    if (user.city !== city) patch.city = city;
    if (user.about !== about) patch.about = about;


    try {
        const [newAvatarUrl, userResult] = await Promise.all([
            avatarPromise,
            Object.keys(patch).length > 0 ? updateUser(patch) : Promise.resolve(null)
        ]);


        if (newAvatarUrl || userResult) {
            instance.close();
            eventBus.emit('user:update', {
                ...patch,
                ...(newAvatarUrl ? { avatar: resolveStaticPath(newAvatarUrl) } : {})
            });
        }
    } catch { }
};
