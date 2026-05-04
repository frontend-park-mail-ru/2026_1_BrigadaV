import styles from './style.module.scss';
import { BasePage } from '@/shared/lib/page/BasePage';
import template from './SearchPage.hbs?compiled';
import { Header } from '@/widgets/Header';
import { PlaceList } from './PlaceList/PlaceList';
import { AppState } from '@/shared/model';
import { Field } from '@/shared/ui';
import { focusField } from '@/shared/lib';
import { getPlaces, Place, searchPlace, getPlacesByCategory } from '@/entities/Place';
import { getCategories, Category } from '@/entities/Category';
import { getRandomElements } from '@/shared/utils';
import { debounce } from '@/shared/utils/lib/debounce';
import { SearchPageParameters } from '../model/types';

const BASE_CATEGORIES_COUNT = 5;

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
    private allPlaces!: Place[];
    private query = '';
    private categories: Category[] = [];
    private selectedCategoryId: number | null = null;

    public static async create(appState: AppState, parameters: SearchPageParameters): Promise<SearchPage> {
        const page = new SearchPage(appState);

        const [places, categories] = await Promise.all([
            getPlaces(),
            getCategories(),
        ]);

        page.allPlaces = places;
        page.randomPlaces = getRandomElements(places, 7);
        page.categories = categories;

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
        };
    }

    private handleInput = async (inputValue: string) => {
        this.selectedCategoryId = null;
        this.updateCategorySelection();

        if (inputValue === '') {
            this.children.placeList.setItems(this.randomPlaces);
            return;
        }

        const searchResults = await searchPlace(inputValue);
        this.children.placeList.setItems(searchResults);
    };

    private updateCategorySelection() {
        const allItems = this.element?.querySelectorAll<HTMLLIElement>(`.${styles['categories__item']}`);
        allItems?.forEach(item => {
            const input = item.querySelector<HTMLInputElement>(`.${styles['categories__input']}`);
            if (input) input.checked = false;
        });
    }

    private handleCategoryClick = async (categoryId: number, checkbox: HTMLInputElement) => {
        // Uncheck all other checkboxes
        const allCheckboxes = this.element?.querySelectorAll<HTMLInputElement>(`.${styles['categories__input']}`);
        allCheckboxes?.forEach(cb => {
            if (cb !== checkbox) cb.checked = false;
        });

        if (this.selectedCategoryId === categoryId && !checkbox.checked) {
            // Deselect — show all
            this.selectedCategoryId = null;
            this.children.placeList.setItems(this.randomPlaces);
            return;
        }

        this.selectedCategoryId = categoryId;

        const filtered = await getPlacesByCategory(categoryId);
        this.children.placeList.setItems(filtered);
    };

    private renderCategories() {
        const baseList = this.fields['categories-list'];
        const extList = this.fields['categories-extended-list'];
        const extWrapper = this.fields['extended-wrapper'];

        if (!baseList) return;

        const baseCategories = this.categories.slice(0, BASE_CATEGORIES_COUNT);
        const extCategories = this.categories.slice(BASE_CATEGORIES_COUNT);

        const renderItem = (cat: Category): HTMLLIElement => {
            const li = document.createElement('li');
            li.className = styles['categories__item'];

            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.className = styles['categories__input'];
            checkbox.addEventListener('change', () => {
                this.handleCategoryClick(cat.id, checkbox);
            });

            li.appendChild(checkbox);
            li.appendChild(document.createTextNode(cat.name));
            return li;
        };

        baseCategories.forEach(cat => baseList.appendChild(renderItem(cat)));

        if (extCategories.length > 0 && extList) {
            extCategories.forEach(cat => extList.appendChild(renderItem(cat)));
        } else if (extWrapper) {
            // Hide the extended section completely if no extra categories
            (extWrapper as HTMLElement).style.display = 'none';
        }
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

    protected override _render(): HTMLElement {
        super._render();

        this.renderCategories();

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
