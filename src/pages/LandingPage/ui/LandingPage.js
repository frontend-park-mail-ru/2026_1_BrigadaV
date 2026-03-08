import template from './LandingPage.hbs?compiled';
import './style.scss';

import { Header } from '@/widgets/header';
import { Hero } from '@/widgets/hero';
import { RecommendedList } from '@/widgets/RecommendedList';

const placesData = [
    {
        image: '/mock/rcmd1.png',
        location: 'Грамаду, Бразилия',
        name: 'Hotel Estalagem St Hubertus',
        price: '23 700',
        isLiked: false
    },
    {
        image: '/mock/rcmd2.png',
        location: 'Грамаду, Бразилия',
        name: 'Hotel Ritta Höppner',
        price: '11 381',
        isLiked: false
    },
    {
        image: '/mock/rcmd3.png',
        location: 'Париж, Франция',
        name: 'Rodin Musée',
        price: '1 269',
        isLiked: false
    },
    {
        image: '/mock/rcmd4.png',
        location: 'Рим, Италия',
        name: 'Roman Forum',
        price: '1 269',
        isLiked: false
    },
    {
        image: '/mock/rcmd5.png',
        location: 'Барселона, Испания',
        name: 'Basilica de Santa Maria del Pi',
        price: '1 994',
        isLiked: true
    },
    {
        image: '/mock/rcmd6.png',
        location: 'Амстердам, Нидерланды',
        name: 'De Hallen Amsterdan',
        price: '33 988',
        isLiked: false
    },
    {
        image: '/mock/rcmd7.png',
        location: 'Бали, Индонезия',
        name: 'Amnaya Resort Kuta',
        price: '5 844',
        isLiked: true
    },
    {
        image: '/mock/rcmd8.png',
        location: 'Барселона, Испания',
        name: 'Plaça Reial',
        price: '12 369',
        isLiked: false
    }
];

export const LandingPage = (appState) => {
    const page = document.createElement('div');

    const html = template({
        header: Header({ user: appState.currentUser }),
        hero: Hero(),
        recommendedList: RecommendedList(placesData)
    });

    page.classList.add('page-wrapper');
    page.innerHTML = html;

    return page;
};
