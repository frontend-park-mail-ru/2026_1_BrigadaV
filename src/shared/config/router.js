import { LandingPage } from '@/pages/LandingPage';
import { LoginPage } from '@/pages/LoginPage';

export const config = {
    landing: {
        href: '/',
        view: LandingPage,
    },
    login: {
        href: '/login',
        view: LoginPage
    }
};

export const appState = {
    currentPath: '/',
    currentUser: null,
    // currentUser: {
    //     name: "Somename",
    //     avatar: "/mock/user-avatar/somename.jpg"
    // }
};
