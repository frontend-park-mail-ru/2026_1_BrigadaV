import './style.scss';

import { BaseComponent } from '@/shared/lib/component/BaseComponent';
import { Field } from '@/shared/ui';
import { getRandomElements, stringToElement } from '@/shared/utils';

import { SearchBarProps, SearchResult } from './model/types';
import template from './SearchBar.hbs?compiled';
import { PlaceDropDownList } from './PlaceDropDownList/PlaceDropDownList';
import { focusField } from '@/shared/lib';
import { debounce } from '@/shared/utils/lib/debounce';
import { PlaceSearchItemProps } from '@/entities/Place/ui/PlaceSearchItem/model/types';
import { fetchPlace, getPlaces, searchPlace } from '@/entities/Place';

export class SearchBar extends BaseComponent {
    declare protected children: {
        searchField: Field;
        dropDownList: PlaceDropDownList;
    };

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
    }

    private handleGlobalClick = (event: Event) => {
        const target = event.target;
        if (!(target instanceof HTMLElement)) return;

        if (this.element && !this.element.contains(target)) {
            this.children.dropDownList.setState('hidden');
        }
    }

    private handleFocus = async (inputValue: string) => {
        if (inputValue !== '') {
            this.children.dropDownList.setState('prompt');
            return;
        }

        this.children.dropDownList.setState('empty');
        // todo add popular places handle
        const places = await getPlaces();
        const randomPlaces = getRandomElements(places, 7).map(place => ({ place }));
        this.children.dropDownList.setItems(randomPlaces);
    }

    private handleInput = async (inputValue: string) => {
        if (inputValue === '') {
            this.children.dropDownList.setState('empty');
            // todo add popular places handle
            const places = await getPlaces();
            const randomPlaces = getRandomElements(places, 7).map(place => ({ place }));
            this.children.dropDownList.setItems(randomPlaces);
            return;
        }

        this.children.dropDownList.setState('prompt');

        const searchResults = await searchPlace(inputValue);
        const topResult = searchResults.slice(0, 7);
        this.children.dropDownList.setItems(topResult.map(item => ({ place: item })));
    }

    protected override _render(): HTMLElement {
        return stringToElement(template(this.props));
    }

    protected override _destroy(): void {
        document.removeEventListener('click', this.handleGlobalClick);
    }
}
