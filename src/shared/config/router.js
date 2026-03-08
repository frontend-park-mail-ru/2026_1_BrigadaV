import { LandingPage } from '@/pages/LandingPage';

export const config = {
    landing: {
        href: '/',
        view: LandingPage,
    },
};

export const appState = {
    currentPath: '/',
    currentUser: null,
    // currentUser: {
    //     name: "Somename",
    //     avatar: "/mock/user-avatar/somename.jpg"
    // }
};
