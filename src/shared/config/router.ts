import { LandingPage } from '@/pages/LandingPage';
import { LoginPage } from '@/pages/LoginPage';
import { SignupPage } from '@/pages/SignupPage';
import { AppState, PageConstructor } from '../model';

export type Route = {
    href: string;
    view: PageConstructor;
}

export const config: Record<string, Route> = {
    landing: {
        href: '/',
        view: LandingPage,
    },
    login: {
        href: '/login',
        view: LoginPage
    },
    signup: {
        href: '/sign-up',
        view: SignupPage
    }
};

export const appState: AppState = {
    currentPath: '/',
    currentUser: null,
};
