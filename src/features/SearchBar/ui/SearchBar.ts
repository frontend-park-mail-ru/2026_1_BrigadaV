import './style.scss';

import { BaseComponent } from '@/shared/lib/component/BaseComponent';
import { Field } from '@/shared/ui';
import { getRandomElements, stringToElement } from '@/shared/utils';

import { SearchBarProps } from './model/types';
import template from './SearchBar.hbs?compiled';
import { PlaceDropDownList } from './PlaceDropDownList/PlaceDropDownList';
import { focusField } from '@/shared/lib';
import { Place } from '@/entities/Place';
import { debounce } from '@/shared/utils/lib/debounce';
import { PlaceSearchItemProps } from '@/entities/Place/ui/PlaceSearchItem/model/types';

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
                onBlur: this.handleBlur,
                onInput: debounce(this.handleInput),
            }),

            dropDownList: new PlaceDropDownList({
                emptyPromptHeader: 'Может заинтересовать',
            }),
        };
    }

    private handleFocus = (inputValue: string) => {
        if (inputValue !== '') {
            this.children.dropDownList.setState('prompt');
            return;
        }
        this.children.dropDownList.setState('empty');
        const initialPlaces = getRandomElements(this.props.places, 2);
        this.children.dropDownList.setItems(initialPlaces);
    }

    private handleBlur = () => {
        this.children.dropDownList.setState('hidden');
    }

    private handleInput = (inputValue: string) => {
        if (inputValue === '') {
            const initialPlaces = getRandomElements(this.props.places, 2);
            this.children.dropDownList.setState('empty');
            this.children.dropDownList.setItems(initialPlaces);
            return;
        }

        this.children.dropDownList.setState('prompt');
        const searchResults = this.filterPlaces(inputValue);
        this.children.dropDownList.setItems(searchResults.slice(2));
    }

    private filterPlaces(searchTerm: string): PlaceSearchItemProps['place'][] {
    }

    protected override _render(): HTMLElement {
        return stringToElement(template(this.props));
    }
}
