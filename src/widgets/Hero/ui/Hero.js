import template from './Hero.hbs?compiled';
import './style.scss'

import { SearchBar } from '@/features/SearchBar';

export const Hero = (props) => {
    return template({
        searchBar: SearchBar({
            className: "hero__search"
        })
    });
}
