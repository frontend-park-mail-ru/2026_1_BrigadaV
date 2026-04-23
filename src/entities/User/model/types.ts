export type UserSummary = {
    id: number;
    nickname: string;
    avatar?: string;
};

export type User = UserSummary & {
    country?: string;
    city?: string;
    about?: string;
    hasReviews: boolean;
    createdAt: Date;
};

export type UserAuth = UserSummary & {
    login?: string;
};
