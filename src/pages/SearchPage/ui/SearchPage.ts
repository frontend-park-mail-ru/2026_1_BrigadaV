import styles from './style.module.scss';
import { BasePage } from '@/shared/lib/page/BasePage';
import template from './SearchPage.hbs?compiled';
import { Header } from '@/widgets/Header';
import { PlaceList } from './PlaceList/PlaceList';
import { AppState } from '@/shared/model';
import { Field } from '@/shared/ui';
import { focusField } from '@/shared/lib';
import { Accordion } from '@/shared/ui/Accordion';

export class SearchPage extends BasePage {
    protected template = template;
    protected styles = styles;
    protected pageClassName = 'search-page';

    declare children: {
        header: Header;
        query: Field;
        placeList: PlaceList;
        categoryAccordion: Accordion;
    };

    public static async create(appState: AppState): Promise<SearchPage> {
        const page = new SearchPage(appState);

        page.setupComponents();
        return page;
    }

    private setupComponents() {
        this.children = {
            header: new Header({
                user: this.appState.currentUser,
            }),

            query: new Field({
                type: 'text',
                rightIcon: '/icons/search.svg',
                onRightIconClick: focusField,
            }),

            categoryAccordion: new Accordion({
                title: 'Категории',
                isOpen: true,
            }),

            placeList: new PlaceList(),
        };
    }
}
