import template from './SearchBar.hbs?compiled';
import './style.scss'

import { Field } from '@/shared/ui/Field';

export const SearchBar = (props) => {
    return template({
        searchField: Field({
            type: "text",
            className: "search__input",
            placeholder: "Куда бы вы хотели отправиться?",
            hasIcon: true,
            iconPath: "/icons/search.svg"
        }),
        ...props
    });
}
