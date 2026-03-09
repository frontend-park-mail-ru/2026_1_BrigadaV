import { LandingPage } from '@/pages/LandingPage';
import { LoginPage } from '@/pages/LoginPage';
import { SignupPage } from '@/pages/SignupPage';

export const config = {
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

export const appState = {
    currentPath: '/',
    currentUser: null,
};
