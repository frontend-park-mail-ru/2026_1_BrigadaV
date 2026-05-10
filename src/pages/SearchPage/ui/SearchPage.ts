import { CategoryAccordion, CategorySidebar, fetchPlaceCategories } from '@/entities/Category';
import { fetchPlaces, Place, searchPlace } from '@/entities/Place';
import { focusField } from '@/shared/lib';
import { Callback } from '@/shared/lib/eventBus/eventBus';
import { BasePage } from '@/shared/lib/page/BasePage';
import { AppState } from '@/shared/model';
import { Field } from '@/shared/ui';
import { debounce } from '@/shared/utils/lib/debounce';
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
        categories: CategoryAccordion | CategorySidebar;
    };

    protected override createHandlers(): Record<string, Callback> {
        return {
            'CategoryAccordion:toggle-category': this.handleCategoryToggle,
            'CategorySidebar:toggle-category': this.handleCategoryToggle,
        };
    }

    private categoryList: { id: number; name: string }[] = [];
    private currentQueryList: Place[] = [];
    private randomPlaces!: Place[];
    private query = '';
    private selectedCategoryIds: number[] = [];
    private isMobile = window.innerWidth < 1024;
    private startX = 0;

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

            categories: this.isMobile
                ? new CategorySidebar({
                    categories: this.categoryList,
                })
                : new CategoryAccordion({
                    categories: this.categoryList,
                }),
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
                (this.children.categories as CategorySidebar).open();
            }
        });
    }

    private handleResize = () => {
        const currentlyMobile = window.innerWidth < 1024;

        if (this.isMobile !== currentlyMobile) {
            this.isMobile = currentlyMobile;
            this.swapCategoryComponent();
        }
    };

    private swapCategoryComponent() {
        if (this.isMobile) {
            this.children.categories = new CategorySidebar({
                categories: this.categoryList,
                activeIds: this.selectedCategoryIds,
            });
        } else {
            this.children.categories = new CategoryAccordion({
                categories: this.categoryList,
                activeIds: this.selectedCategoryIds,
            });
        }

        const container = this.element?.querySelector('.js-categories');
        if (container) {
            const renderedCategories = this.children.categories.render();
            renderedCategories.classList.add('js-categories');
            container.replaceWith(renderedCategories);
        }
    }

    private handleInput = async (inputValue: string) => {
        if (inputValue === '') {
            this.currentQueryList = this.randomPlaces;

        } else {
            const searchRes = await searchPlace(inputValue);
            if (searchRes.ok) {
                this.currentQueryList = searchRes.data;
            }
        }

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
    };

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
