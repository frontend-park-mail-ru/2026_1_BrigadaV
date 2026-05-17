import { fetchPlaceCategories } from '@/entities/Category';
import { fetchPlaces, Place, searchPlace } from '@/entities/Place';
import { focusField } from '@/shared/lib';
import { Callback } from '@/shared/lib/eventBus/eventBus';
import { BasePage } from '@/shared/lib/page/BasePage';
import { AppState } from '@/shared/model';
import { Field } from '@/shared/ui';
import { debounce } from '@/shared/utils/lib/debounce';
import { Filters } from '@/widgets/Filters';
import { FiltersState } from '@/widgets/Filters/model/types';
import { Header } from '@/widgets/Header';

import { SearchPageParameters } from '../model/types';
import { PlaceList } from './PlaceList/PlaceList';
import template from './SearchPage.hbs?compiled';
import styles from './style.module.scss';

export class SearchPage extends BasePage {
    protected template = template;
    protected styles = styles;
    protected pageClassName = 'search-page';

    declare children: {
        header: Header;
        query: Field;
        placeList: PlaceList;
        filters: Filters;
    };

    private categoryList: { id: number; name: string }[] = [];
    private currentQueryList: Place[] = [];
    private randomPlaces!: Place[];
    private query = '';

    private currentFilters: FiltersState = {
        categoryIds: [],
        ratingIds: [],
        reviewCount: 0,
    };

    private isMobile = window.innerWidth < 1024;
    private startX = 0;

    protected override createHandlers(): Record<string, Callback> {
        return {
            'Filters:change': this.handleFiltersChange,
        };
    }

    public static async create(appState: AppState, parameters: SearchPageParameters): Promise<SearchPage> {
        const page = new SearchPage(appState);

        const [placesRes, categoriesRes] = await Promise.all([
            fetchPlaces(),
            fetchPlaceCategories()
        ]);

        if (placesRes.ok) {
            page.randomPlaces = placesRes.data;
            page.currentQueryList = page.randomPlaces;
        }

        if (categoriesRes.ok) {
            page.categoryList = categoriesRes.data;
        }

        if (parameters.query) {
            page.query = parameters.query;
        }

        page.setupComponents();
        return page;
    }

    private async setupComponents() {
        const authorized = Boolean(this.appState.currentUser);

        this.children = {
            header: new Header({ user: this.appState.currentUser }),
            query: new Field({
                type: 'text',
                rightIcon: '/icons/search.svg',
                onRightIconClick: focusField,
                onInput: debounce(this.handleInput),
                attributes: { value: this.query }
            }),
            placeList: new PlaceList({
                authorized,
                ...(!this.query && { defaultPlaces: this.randomPlaces })
            }),
            filters: new Filters({ categories: this.categoryList }),
        };
    }

    protected override initListeners(): void {
        super.initListeners();
        window.addEventListener('resize', this.handleResize);

        this.element?.addEventListener('touchstart', (event) => {
            this.startX = event.touches[0].clientX;
        });

        this.element?.addEventListener('touchend', (event) => {
            const endX = event.changedTouches[0].clientX;
            if (this.isMobile && endX - this.startX > 80) {
                (this.children.filters).open();
            }
        });
    }

    private handleResize = () => {
        this.isMobile = window.innerWidth < 1024;
    };

    private handleInput = async (inputValue: string) => {
        if (inputValue === '') {
            this.currentQueryList = this.randomPlaces;
        } else {
            const searchRes = await searchPlace(inputValue);
            if (searchRes.ok) {
                this.currentQueryList = searchRes.data;
            }
        }

        this.fetchFilteredData();
    };

    private handleFiltersChange = async (filtersState: FiltersState) => {
        this.currentFilters = filtersState;
        await this.fetchFilteredData();
    };

    private async fetchFilteredData() {
        // TODO add search with filters
        this.applyFilters();
    }

    private applyFilters() {
        if (!this.element) return;

        let filtered = this.currentQueryList;

        if (this.currentFilters.categoryIds.length > 0) {
            filtered = filtered.filter(place =>
                this.currentFilters.categoryIds.includes(place.category.id)
            );
        }

        this.children.placeList.setItems(filtered);
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

    protected override _destroy(): void {
        window.removeEventListener('resize', this.handleResize);
    }
}
