export type UserAuth = {
    id: number;
    login: string;
    nickname: string;
    avatar?: string;
}

export type User = {
    id: number;
    nickname: string;
    avatar?: string;
    country: string;
    city: string;
    about?: string;
    commentCount: number;
    createdAt: Date;
}

export type UserSummary = {
    id: number;
    nickname: string;
    avatar?: string,
}
