import { AttractionPage } from '@/pages/AttractionPage';
import { LandingPage } from '@/pages/LandingPage';
import { LoginPage } from '@/pages/LoginPage';
import { ProfilePage } from '@/pages/ProfilePage';
import { SignupPage } from '@/pages/SignupPage';
import { TripDetailPage } from '@/pages/TripDetailPage';
import { TripListPage } from '@/pages/TripListPage';

import { AppState, IPageConstructor } from '../model';
import { PlaceSelectPage } from '@/pages/PlaceSelectPage';

export type Route = {
    href: string;
    hrefRegex: RegExp,
    view: IPageConstructor;
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
        hrefRegex: /^\/trip\/(?<tripId>[0-9]+)$/,
        view: TripDetailPage,
        authOnly: true,
    },
    attraction: {
        href: '/attraction/:int',
        hrefRegex: /^\/attraction\/(?<placeId>[0-9]+)$/,
        view: AttractionPage,
    },
    placeSelect: {
        href: '/place-select/:int',
        hrefRegex: /^\/place-select\/(?<tripId>[0-9]+)$/,
        view: PlaceSelectPage,
        authOnly: true,
    }
};

export const appState: AppState = {
    currentPath: '/',
    currentUser: null,
};
