import { LoginDTO, RegisterDTO } from '@/shared/api';

import { UserAuth } from '../model/types';

export const mapUserAuth = (userData: LoginDTO | RegisterDTO): UserAuth => {
    return {
        id: ('user_id' in userData) ? userData.user_id : userData.id,
        login: userData.login,
        nickname: userData.nickname,
        avatar: userData.avatar_url,
    };
};
