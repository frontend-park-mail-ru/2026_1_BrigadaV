import { injectComponents, stringToElement } from '@/shared/utils';
import template from './ProfileNavigation.hbs?compiled';
import './style.scss';
import { ProfileNavigationProps } from '../model/types';
import { Tabs } from '@/shared/ui/Tabs';

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
