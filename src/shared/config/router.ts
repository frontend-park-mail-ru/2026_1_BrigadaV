import { LandingPage } from '@/pages/LandingPage';
import { LoginPage } from '@/pages/LoginPage';
import { ProfilePage } from '@/pages/ProfilePage';
import { SignupPage } from '@/pages/SignupPage';

import { AppState, PageConstructor } from '../model';

export type Route = {
    href: string;
    view: PageConstructor;
    authOnly?: boolean;
    nonAuthOnly?: boolean;
}

export const config: Record<string, Route> = {
    landing: {
        href: '/',
        view: LandingPage,
    },
    login: {
        href: '/login',
        view: LoginPage,
        nonAuthOnly: true,
    },
    signup: {
        href: '/sign-up',
        view: SignupPage,
        nonAuthOnly: true,
    },
    profile: {
        href: '/profile',
        view: ProfilePage,
        authOnly: true,
    }
};

export const appState: AppState = {
    currentPath: '/',
    currentUser: null,
};
