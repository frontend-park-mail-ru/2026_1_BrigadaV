import { UserSummary } from '@/entities/User';

export type UserSessionProps = {
    className?: string;
    user?: Pick<UserSummary, 'nickname' | 'avatar'> | null;
    authPrompt?: {
        prompt: string;
        buttonText: string;
        href: string;
    };
};
