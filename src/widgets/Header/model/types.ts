import { UserSummary } from '@/entities/User';

export type HeaderProps = {
    user: Pick<UserSummary, 'nickname' | 'avatar'> | null;
    withSearch?: boolean;
    authPrompt?: {
        prompt: string;
        buttonText: string;
        href: string;
    }
}
