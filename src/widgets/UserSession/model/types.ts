import { User } from '@/shared/model';

export type UserSessionProps = {
    className?: string;
    user?: User | null;
    authPrompt?: {
        prompt: string;
        buttonText: string;
        href: string;
    };
};
