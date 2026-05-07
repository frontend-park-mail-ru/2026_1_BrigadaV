import styles from './style.module.scss';
import { BasePage } from '@/shared/lib/page/BasePage';
import template from './SearchPage.hbs?compiled';
import { Header } from '@/widgets/Header';
import { PlaceList } from './PlaceList/PlaceList';
import { AppState } from '@/shared/model';
import { Field } from '@/shared/ui';
import { focusField } from '@/shared/lib';
import { getPlaces, Place, searchPlace } from '@/entities/Place';
import { debounce } from '@/shared/utils/lib/debounce';
import { SearchPageParameters } from '../model/types';
import { CategoryAccordion, fetchPlaceCategories } from '@/entities/Category';
import { Callback } from '@/shared/lib/eventBus/eventBus';

export class SearchPage extends BasePage {
    protected template = template;
    protected styles = styles;
    protected pageClassName = 'search-page';

    declare children: {
        header: Header;
        query: Field;
        placeList: PlaceList;
        categories: CategoryAccordion;
    };

    protected override get eventHandlers(): Record<string, Callback> {
        return {
            'CategoryAccordion:toggle-category': this.handleCategoryToggle
        }
    }

    private categoryList: { id: number; name: string }[] = [];
    private currentQueryList: Place[] = [];
    private randomPlaces!: Place[];
    private query = '';
    private selectedCategoryIds: number[] = [];

    public static async create(appState: AppState, parameters: SearchPageParameters): Promise<SearchPage> {
        const page = new SearchPage(appState);

        page.randomPlaces = await getPlaces();

        page.currentQueryList = page.randomPlaces;

        page.categoryList = await fetchPlaceCategories();

        if (parameters.query) {
            page.query = parameters.query;
        }

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
                onInput: debounce(this.handleInput),
                attributes: {
                    value: this.query,
                }
            }),

            placeList: new PlaceList({
                authorized,
                ...(!this.query && { defaultPlaces: this.randomPlaces })
            }),

            categories: new CategoryAccordion({
                categories: this.categoryList,
            }),
        };
    }

    private handleInput = async (inputValue: string) => {
        if (inputValue === '') {
            this.currentQueryList = this.randomPlaces;
            return;
        }

        this.currentQueryList = await searchPlace(inputValue);
        this.applyFilters();
    };

    private applyFilters() {
        if (!this.element) return;

        if (this.selectedCategoryIds.length === 0) {
            this.children.placeList.setItems(this.currentQueryList);
            return;
        }

        const filtered = this.currentQueryList.filter(place =>
            this.selectedCategoryIds.includes(place.category.id)
        );

        this.children.placeList.setItems(filtered);
    }


    private handleCategoryToggle = (data: { ids: number[] }) => {
        this.selectedCategoryIds = data.ids;
        this.applyFilters();
    }

    public override render(): HTMLElement {
        super.render();
        if (this.query) {
            this.handleInput(this.query);
        }
        return this.element!;
    }

    protected override _finalize(): void {
        super._finalize();

        const currentQuery = this.children.query.getValue();

        if (currentQuery === this.query) return;

        const url = new URL(window.location.href);
        if (currentQuery) {
            url.searchParams.set('q', currentQuery);
        } else {
            url.searchParams.delete('q');
        }

        window.history.replaceState(this.appState, '', url.pathname + url.search);
    }
}
