import './style.scss';

import { BaseComponent } from '@/shared/lib/component/BaseComponent';
import { Field } from '@/shared/ui';
import { getRandomElements, stringToElement } from '@/shared/utils';

import { SearchBarProps, SearchResult } from './model/types';
import template from './SearchBar.hbs?compiled';
import { PlaceDropDownList } from './PlaceDropDownList/PlaceDropDownList';
import { focusField } from '@/shared/lib';
import { debounce } from '@/shared/utils/lib/debounce';
import { getPlaces, searchPlace } from '@/entities/Place';
import { navigate } from '@/shared/router';

export class SearchBar extends BaseComponent {
    declare protected children: {
        searchField: Field;
        dropDownList: PlaceDropDownList;
    };

    private cachedSuggestions: SearchResult[] | null = null;

    constructor(private props: SearchBarProps) {
        super();

        this.children = {
            searchField: new Field({
                type: 'text',
                className: 'search__field',
                rightIcon: '/icons/search.svg',
                attributes: {
                    placeholder: props.placeholder,
                },
                onRightIconClick: focusField,

                onFocus: this.handleFocus,
                onInput: debounce(this.handleInput),
            }),

            dropDownList: new PlaceDropDownList({
                emptyPromptHeader: 'Может заинтересовать',
            }),
        };
    }

    protected override initListeners(): void {
        super.initListeners();
        document.addEventListener('click', this.handleGlobalClick);
        this.element?.addEventListener('submit', this.handleSearchRedirect);
    }

    private handleSearchRedirect = (event: Event) => {
        event.preventDefault();

        const query = this.children.searchField.getValue();

        const url = new URL('/search', window.location.origin);
        url.searchParams.set('q', query);
        navigate(url.pathname + url.search);
    };

    private handleGlobalClick = (event: Event) => {
        const target = event.target;
        if (!(target instanceof HTMLElement)) return;

        if (this.element && !this.element.contains(target)) {
            this.children.dropDownList.setState('hidden');
        }
    };

    private handleFocus = async (inputValue: string) => {
        if (inputValue !== '') {
            this.children.dropDownList.resume();
            return;
        }

        this.children.dropDownList.setState('empty');
        // todo add popular places handle
        if (!this.cachedSuggestions) {
            const places = await getPlaces();
            this.cachedSuggestions = getRandomElements(places, 7).map(place => ({ place }));
        }

        this.children.dropDownList.setItems(this.cachedSuggestions);
    };

    private handleInput = async (inputValue: string) => {
        const { dropDownList } = this.children;

        if (inputValue === '') {
            dropDownList.setState('empty');
            if (this.cachedSuggestions) {
                dropDownList.setItems(this.cachedSuggestions);
            }
            return;
        }

        const searchResults = await searchPlace(inputValue);
        const topResults = searchResults.slice(0, 7);
        if (topResults.length === 0) {
            dropDownList.setState('no-results');
            dropDownList.clear();
            return;
        }

        dropDownList.setState('prompt');
        dropDownList.setItems(topResults.map(item => ({ place: item })));
    };

    protected override _render(): HTMLElement {
        return stringToElement(template(this.props));
    }

    protected override _destroy(): void {
        document.removeEventListener('click', this.handleGlobalClick);
    }
}
