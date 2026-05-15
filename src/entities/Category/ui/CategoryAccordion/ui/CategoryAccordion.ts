import { eventBus } from '@/shared/lib/eventBus/eventBus';
import { Accordion } from '@/shared/ui/Accordion';

import { CategoryAccordionProps, SingleCategoryItem } from '../model/types';
import styles from './style.module.scss';

export class CategoryAccordion extends Accordion<SingleCategoryItem, CategoryAccordionProps> {
    protected override baseCount: number = 3;
    private activeCategoryIds: number[] = [];

    constructor(props: CategoryAccordionProps) { super(props); }

    protected override createItem(category: SingleCategoryItem): HTMLElement {
        const li = document.createElement('li');
        li.className = styles['categories__item'];

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.className = styles['categories__input'];
        checkbox.dataset.id = category.id.toString();
        checkbox.checked = this.activeCategoryIds.includes(category.id);

        checkbox.addEventListener('change', this.handleCheckboxToggle);

        li.appendChild(checkbox);
        li.append(category.name);
        return li;
    }

    private handleCheckboxToggle = (event: Event) => {
        const target = event.target as HTMLInputElement;
        const id = Number(target.dataset.id);

        if (target.checked) {
            this.activeCategoryIds.push(id);
        } else {
            this.activeCategoryIds = this.activeCategoryIds.filter(activeId => activeId !== id);
        }

        eventBus.emit('CategoryAccordion:toggle-category', {
            ids: this.activeCategoryIds
        });
    };

    public setSelectedIds(ids: number[]): void {
        this.activeCategoryIds = ids;
        const checkboxes = this.element?.querySelectorAll<HTMLInputElement>('input[type="checkbox"]');
        checkboxes?.forEach(checkbox => {
            checkbox.checked = ids.includes(Number(checkbox.dataset.id));
        });
    }

    public override render(): HTMLElement {
        if (this.props.activeIds) {
            this.activeCategoryIds = this.props.activeIds;
        }

        return super.render();
    }
}
