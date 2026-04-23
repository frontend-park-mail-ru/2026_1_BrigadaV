import './style.scss';

import { BaseComponent } from '@/shared/lib/component/BaseComponent';
import { Tabs } from '@/shared/ui/Tabs';
import { stringToElement } from '@/shared/utils';

import { ProfileNavigationProps } from '../model/types';
import template from './ProfileNavigation.hbs?compiled';

export class ProfileNavigation extends BaseComponent {
    protected override children: {
        tabs: Tabs;
    };

    constructor(private props: ProfileNavigationProps) {
        super();
        this.children = {
            tabs: new Tabs({
                className: 'navigation',
                tabs: {
                    'about': 'Обо мне',
                    'trips': 'Поездки',
                    'comments': 'Отзывы',
                },
                activeId: 'about',
            }),
        };
    }

    protected override _render(): HTMLElement {
        return stringToElement(template(this.props));
    }
}
