import { eventBus } from '@/shared/lib';
import { BaseComponent } from '@/shared/lib/component/BaseComponent';
import { stringToElement } from '@/shared/utils';

import { TabsProps } from '../model/types';
import template from './Tabs.hbs?compiled';

export class Tabs extends BaseComponent {
    private activeTabId: string;
    private tabItems: Record<string, HTMLLIElement> = {};

    constructor(private props: TabsProps) {
        super();
        this.activeTabId = props.activeId;
    }

    protected override initListeners(): void {
        super.initListeners();
        this.element?.addEventListener('click', this.handleTabClick);
    }

    private handleTabClick = (event: MouseEvent): void => {
        const target = event.target;
        if (!(target instanceof HTMLElement)) return;

        const button = target.closest<HTMLButtonElement>('[data-tab-id]');
        if (!button) return;

        const nextId = button.dataset.tabId!;
        if (nextId === this.activeTabId) return;

        this.updateActiveTab(this.activeTabId, nextId);

        this.activeTabId = nextId;
        eventBus.emit('Tabs:change', nextId);
    };

    private updateActiveTab(oldId: string, newId: string): void {
        const activeClass = `${this.props.className}__item--active`;

        this.tabItems[oldId].classList.remove(activeClass);
        this.tabItems[newId].classList.add(activeClass);
    }

    protected override _render(): HTMLElement {
        const element = stringToElement(template(this.props));

        element.querySelectorAll<HTMLButtonElement>('[data-tab-id]').forEach(button => {
            const id = button.dataset.tabId;
            const container = button.closest('li');
            if (id && container) {
                this.tabItems[id] = container;
            }
        });

        return element;
    }
}
