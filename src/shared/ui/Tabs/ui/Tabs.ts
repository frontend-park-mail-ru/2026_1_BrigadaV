import { stringToElement } from '@/shared/utils';

import { TabsProps } from '../model/types';
import template from './Tabs.hbs?compiled';

export class Tabs {
    element?: HTMLElement;
    activeTabId: string;

    constructor(private props: TabsProps) {
        this.activeTabId = this.props.activeId;
    }

    private initListeners(): void {
        this.element?.addEventListener('click', this.handleTabClick);
    }

    private handleTabClick = (event: MouseEvent): void => {
        const target = event.target;
        if (!(target instanceof HTMLElement)) return;

        const button = target.closest<HTMLButtonElement>('[data-tab-id]');
        if (!button) return;

        const nextId = button.dataset.tabId!;
        if (nextId === this.activeTabId) return;

        this.updateActiveTab(nextId);

        this.activeTabId = nextId;
        this.props.onTabChange(nextId);
    };

    private updateActiveTab(newId: string): void {
        const activeClass = `${this.props.className}__item--active`;

        this.element?.querySelector(`.${activeClass}`)?.classList.remove(activeClass);
        this.element?.querySelector(`[data-tab-id="${newId}"]`)
            ?.closest('li')
            ?.classList.add(activeClass);
    }

    public render(): HTMLElement {
        this.element = stringToElement(template(this.props));
        this.initListeners();
        return this.element;
    }
}
