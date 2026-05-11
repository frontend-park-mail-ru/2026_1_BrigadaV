import { User, UserAuth, UserSummary } from '../model/types';
import { LoginDTO, RegisterDTO, UserDTO, UserSummaryDTO } from './types';

export const mapUserSummary = (dto: UserSummaryDTO): UserSummary => ({
    id: dto.id,
    nickname: dto.nickname,
    avatar: dto.avatar_url || dto.avatar,
});

export const mapUser = (dto: UserDTO): User => ({
    ...mapUserSummary(dto),
    ...dto,
    createdAt: new Date(dto.createdAt),
});

export const mapUserAuth = (dto: LoginDTO | RegisterDTO): UserAuth => ({
    ...mapUserSummary({
        id: ('user_id' in dto) ? dto.user_id : dto.id,
        nickname: dto.nickname,
        avatar_url: dto.avatar_url,
    }),
    login: dto.login,
});
