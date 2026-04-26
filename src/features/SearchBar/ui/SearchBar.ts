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
import { Fzf } from 'fzf';

export class SearchBar extends BaseComponent {
    declare protected children: {
        searchField: Field;
        dropDownList: PlaceDropDownList;
    };

    private fzf: Fzf<PlaceSearchItemProps['place'][]>;

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

        this.fzf = new Fzf(props.places || [], {
            selector: (item) => item.name,
            normalize: true,
            limit: 4,
        });
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

    private handleFocus = (inputValue: string) => {
        if (inputValue !== '') {
            this.children.dropDownList.setState('prompt');
            return;
        }

        this.children.dropDownList.setState('empty');
        const randomPlaces = getRandomElements(this.props.places, 2).map(place => ({ place }));
        this.children.dropDownList.setItems(randomPlaces);
    }

    private handleInput = (inputValue: string) => {
        if (inputValue === '') {
            this.children.dropDownList.setState('empty');
            const randomPlaces = getRandomElements(this.props.places, 2).map(place => ({ place }));
            this.children.dropDownList.setItems(randomPlaces);
            return;
        }

        this.children.dropDownList.setState('prompt');

        const searchResults = this.fzf.find(inputValue);
        this.children.dropDownList.setItems(searchResults.map((entry) => ({
            place: entry.item,
            positions: entry.positions,
        })));
    }

    protected override _render(): HTMLElement {
        return stringToElement(template(this.props));
    }

    protected override _destroy(): void {
        document.removeEventListener('click', this.handleGlobalClick);
    }
}
