import './style.scss';

import { Tabs } from '@/shared/ui/Tabs';
import { injectComponents, stringToElement } from '@/shared/utils';

import { ProfileNavigationProps } from '../model/types';
import template from './ProfileNavigation.hbs?compiled';

export class ProfileNavigation {
    element?: HTMLElement;
    tabs?: Tabs;

    constructor(private props: ProfileNavigationProps) {
        this.tabs = new Tabs({
            className: 'navigation',
            tabs: {
                'about': 'Обо мне',
                'trips': 'Поездки',
                'comments': 'Отзывы',
            },
            activeId: 'about',
            onTabChange: this.handleTabChange,
        });
    }

    private handleTabChange = (tabId: string): void => {
        this.props.onTabChange(tabId);
    };

    public render(): HTMLElement {
        this.element = stringToElement(template());
        injectComponents(this.element, {
            'tabs': this.tabs,
        });
        return this.element;
    }
}
