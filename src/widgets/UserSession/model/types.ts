import { UserAuth } from '@/entities/User';

export type UserSessionProps = {
    className?: string;
    user?: UserAuth | null;
    authPrompt?: {
        prompt: string;
        buttonText: string;
        href: string;
    };
};
