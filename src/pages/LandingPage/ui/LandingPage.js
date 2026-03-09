import template from './LandingPage.hbs?compiled';
import './style.scss';

import { Header } from '@/widgets/header';
import { Hero } from '@/widgets/hero';
import { RecommendedList } from '@/widgets/RecommendedList';

export const LandingPage = async (appState) => {
    const page = document.createElement('div');

    const html = template({
        header: Header({ user: appState.currentUser }),
        hero: Hero(),
        recommendedList: await RecommendedList({ user: appState.currentUser })
    });

    page.classList.add('page-wrapper');
    page.innerHTML = html;

    return page;
};
