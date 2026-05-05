import styles from './style.module.scss';
import { BasePage } from '@/shared/lib/page/BasePage';
import template from './SearchPage.hbs?compiled';
import { Header } from '@/widgets/Header';
import { PlaceList } from './PlaceList/PlaceList';
import { AppState } from '@/shared/model';
import { Field } from '@/shared/ui';
import { focusField } from '@/shared/lib';
import { fetchPlaceCategories, getPlaces, Place, searchPlace } from '@/entities/Place';
import { debounce } from '@/shared/utils/lib/debounce';
import { SearchPageParameters } from '../model/types';

export class SearchPage extends BasePage {
    protected template = template;
    protected styles = styles;
    protected pageClassName = 'search-page';

    declare children: {
        header: Header;
        query: Field;
        placeList: PlaceList;
    };

    private categoryList: { id: number; name: string }[] = [];
    private currentQueryList: Place[] = [];
    private randomPlaces!: Place[];
    private query = '';

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

        const checkedInputs = this.element.querySelectorAll<HTMLInputElement>(
            `.${this.styles['categories__input']}:checked`
        );
        const selectedIds = Array.from(checkedInputs).map(input => input.dataset.id);

        if (selectedIds.length === 0) {
            this.children.placeList.setItems(this.currentQueryList);
            return;
        }

        const filtered = this.currentQueryList.filter(place =>
            selectedIds.includes(place.categoryId?.toString())
        );

        this.children.placeList.setItems(filtered);
    }

    private renderCategories() {
        const baseContainer = this.fields['category-base'];
        const extendedContainer = this.fields['category-extended'];

        const baseCategories = this.categoryList.slice(0, 4);
        const extendedCategories = this.categoryList.slice(4);

        const createItem = (category: { id: number; name: string }) => {
            const li = document.createElement('li');
            li.className = this.styles['categories__item'];

            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.className = this.styles['categories__input'];
            checkbox.dataset.id = category.id.toString();
            checkbox.addEventListener('change', () => this.applyFilters());

            li.appendChild(checkbox);
            li.append(category.name);
            return li;
        };

        baseCategories.forEach(category => baseContainer.appendChild(createItem(category)));
        extendedCategories.forEach(category => extendedContainer.appendChild(createItem(category)));
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

    public override render(): HTMLElement {
        super.render();
        if (this.query) {
            this.handleInput(this.query);
        }
        this.renderCategories();
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
