import { LandingPage } from '@/pages/LandingPage';
import { LoginPage } from '@/pages/LoginPage';
import { ProfilePage } from '@/pages/ProfilePage';
import { SignupPage } from '@/pages/SignupPage';

import { AppState, PageConstructor } from '@/shared/model';
import { TripListPage } from '@/pages/TripListPage';
import { TripDetailPage } from '@/pages/TripDetailPage';

export type Route = {
    href: string;
    hrefRegex: RegExp,
    view: PageConstructor;
    authOnly?: boolean;
    guestOnly?: boolean;
}

export const config: Record<string, Route> = {
    landing: {
        href: '/',
        hrefRegex: /^\/$/,
        view: LandingPage,
    },
    login: {
        href: '/login',
        view: LoginPage,
        hrefRegex: /^\/login$/,
        guestOnly: true,
    },
    signup: {
        href: '/sign-up',
        hrefRegex: /^\/sign-up$/,
        view: SignupPage,
        guestOnly: true,
    },
    profile: {
        href: '/profile',
        hrefRegex: /^\/profile$/,
        view: ProfilePage,
        authOnly: true,
    },
    tripList: {
        href: '/trip-list',
        hrefRegex: /^\/trip-list$/,
        view: TripListPage,
        authOnly: true,
    },
    tripDetail: {
        href: '/trip/:int',
        hrefRegex: /^\/trip\/[0-9]+$/,
        view: TripDetailPage,
        authOnly: true,
    }
};

export const appState: AppState = {
    currentPath: '/',
    currentUser: null,
};
