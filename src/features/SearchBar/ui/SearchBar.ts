import './style.scss';

import { BaseComponent } from '@/shared/lib/component/BaseComponent';
import { Field } from '@/shared/ui';
import { stringToElement } from '@/shared/utils';

import { SearchBarProps } from './model/types';
import template from './SearchBar.hbs?compiled';

export class SearchBar extends BaseComponent {
    declare protected children: {
        searchField: Field;
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
                    disabled: '',
                }
            }),
        };
    }

    protected override _render(): HTMLElement {
        return stringToElement(template(this.props));
    }
}
