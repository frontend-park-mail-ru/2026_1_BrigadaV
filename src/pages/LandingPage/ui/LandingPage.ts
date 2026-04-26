import { BasePage } from '@/shared/lib/page/BasePage';
import { AppState } from '@/shared/model';
import { Header } from '@/widgets/Header';
import { Hero } from '@/widgets/Hero';
import { RecommendedList } from '@/widgets/RecommendedList';

import template from './LandingPage.hbs?compiled';
import styles from './style.module.scss';
import { getPlaces, Place } from '@/entities/Place';
import { SearchBar } from '@/features/SearchBar';

export class LandingPage extends BasePage {
    protected template = template;
    protected styles = styles;
    protected pageClassName = 'landing-page';

    declare children: {
        header: Header;
        hero: Hero;
        recommendedList: RecommendedList;
    };

    private placeList!: Place[];

    public static async create(appState: AppState): Promise<LandingPage> {
        const page = new LandingPage(appState);

        const places = await getPlaces();
        page.placeList = places;

        page.setupComponents();
        return page;
    }

    private setupComponents() {
        const searchBar = new SearchBar({
            withButton: true,
            placeholder: 'Куда бы вы хотели отправиться?',
            places: this.placeList,
        });

        this.children = {
            header: new Header({
                user: this.appState.currentUser,
            }),

            hero: new Hero({
                searchSlot: searchBar,
            }),

            recommendedList: new RecommendedList({
                authorized: Boolean(this.appState.currentUser),
                places: this.placeList,
            }),
        };
    }
}
