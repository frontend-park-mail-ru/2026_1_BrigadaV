import styles from './style.module.scss';
import { BasePage } from '@/shared/lib/page/BasePage';
import template from './SearchPage.hbs?compiled';
import { Header } from '@/widgets/Header';
import { PlaceList } from './PlaceList/PlaceList';
import { AppState } from '@/shared/model';
import { Field } from '@/shared/ui';
import { focusField } from '@/shared/lib';
import { getPlaces, Place, searchPlace } from '@/entities/Place';
import { getRandomElements } from '@/shared/utils';

export class SearchPage extends BasePage {
    protected template = template;
    protected styles = styles;
    protected pageClassName = 'search-page';

    declare children: {
        header: Header;
        query: Field;
        placeList: PlaceList;
    };

    private randomPlaces!: Place[];

    public static async create(appState: AppState): Promise<SearchPage> {
        const page = new SearchPage(appState);

        const places = await getPlaces();
        page.randomPlaces = getRandomElements(places, 7);

        page.setupComponents();
        return page;
    }

    private async setupComponents() {
        const authorized = Boolean(this.appState.currentUser);

        this.children = {
            header: new Header({
                user: this.appState.currentUser,
            }),

            query: new Field({
                type: 'text',
                rightIcon: '/icons/search.svg',
                onRightIconClick: focusField,
                onInput: this.handleInput,
            }),

            placeList: new PlaceList({
                defaultPlaces: this.randomPlaces,
                authorized,
            }),
        };
    }

    private handleInput = async (inputValue: string) => {
        if (inputValue === '') {
            this.children.placeList.setItems(this.randomPlaces);
            return;
        }

        const searchResults = await searchPlace(inputValue);
        this.children.placeList.setItems(searchResults);
    }

    protected override initListeners(): void {
        super.initListeners();

        const toggle = this.fields['category-toggle'];
        const accordion = this.fields['category-accordion'];
        const extendedWrapper = this.fields['extended-wrapper'];

        toggle.addEventListener('click', () => {
            const isOpened = accordion.classList.contains(styles['categories--gap-open']);

            if (!isOpened) {
                accordion.classList.add(styles['categories--gap-open']);

                const handleGapEnd = (e: TransitionEvent) => {
                    if (e.propertyName === 'column-gap') {
                        accordion.removeEventListener('transitionend', handleGapEnd);

                        extendedWrapper.style.display = 'grid';

                        setTimeout(() => {
                            accordion.classList.add(styles['categories--content-open']);
                        }, 0);
                    }
                };
                accordion.addEventListener('transitionend', handleGapEnd);

            } else {
                accordion.classList.remove(styles['categories--content-open']);

                const handleContentEnd = (e: TransitionEvent) => {
                    if (e.propertyName === 'grid-template-rows') {
                        accordion.removeEventListener('transitionend', handleContentEnd);

                        accordion.classList.remove(styles['categories--gap-open']);
                        accordion.addEventListener('transitionend', () => extendedWrapper.style.display = 'none', { once: true });
                    }
                };
                accordion.addEventListener('transitionend', handleContentEnd);
            }
        });
    }
}
