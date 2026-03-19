import { LoginDTO, RegisterDTO } from '@/shared/api';

import { User } from '@/shared/model';

export const mapUser = (userData: LoginDTO | RegisterDTO): User => {
    return {
       id: ('user_id' in userData) ? userData.user_id : userData.id,
       login: userData.login,
       nickname: userData.nickname,
       avatar: userData.avatar_url,
    }
}
