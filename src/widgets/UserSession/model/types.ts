import { User } from '@/entities/User';

export type UserSessionProps = {
    className?: string;
    user?: User | null;
    authPrompt?: {
        prompt: string;
        buttonText: string;
        href: string;
    };
};
