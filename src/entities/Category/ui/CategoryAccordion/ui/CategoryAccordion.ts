import { BaseComponent } from '@/shared/lib/component/BaseComponent';
import { eventBus } from '@/shared/lib/eventBus/eventBus';
import { stringToElement } from '@/shared/utils';

import { CategoryAccordionProps } from '../model/types';
import template from './CategoryAccordion.hbs?compiled';
import styles from './style.module.scss';

export class CategoryAccordion extends BaseComponent {
    private activeCategoryIds: number[] = [];

    constructor(private props: CategoryAccordionProps) { super(); }

    private renderCategories(element: HTMLElement) {
        const baseContainer = element.querySelector('[data-ref="category-base"]');
        const extendedContainer = element.querySelector('[data-ref="category-extended"]');

        if (!baseContainer || !extendedContainer) return;

        const baseCategories = this.props.categories.slice(0, 4);
        const extendedCategories = this.props.categories.slice(4);

        const createItem = (category: { id: number; name: string }) => {
            const li = document.createElement('li');
            li.className = styles['categories__item'];

            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.className = styles['categories__input'];
            checkbox.dataset.id = category.id.toString();

            checkbox.addEventListener('change', () => {
                const id = category.id;

                if (checkbox.checked) {
                    this.activeCategoryIds.push(id);
                } else {
                    this.activeCategoryIds = this.activeCategoryIds.filter(activeId => activeId !== id);
                }

                eventBus.emit('CategoryAccordion:toggle-category', {
                    ids: this.activeCategoryIds
                });
            });

            li.appendChild(checkbox);
            li.append(category.name);
            return li;
        };

        baseCategories.forEach(category => baseContainer.appendChild(createItem(category)));
        extendedCategories.forEach(category => extendedContainer.appendChild(createItem(category)));
    }

    private handleToggleClick = () => {
        if (!this.element) return;

        const extendedWrapper = this.fields['extended-wrapper'];
        const isOpened = this.element.classList.contains(styles['categories--gap-open']);

        if (!isOpened) {
            this.element.classList.add(styles['categories--gap-open']);

            const handleGapEnd = (e: TransitionEvent) => {
                if (e.propertyName === 'column-gap') {
                    this.element?.removeEventListener('transitionend', handleGapEnd);

                    extendedWrapper.style.display = 'grid';

                    requestAnimationFrame(() => {
                        this.element?.classList.add(styles['categories--content-open']);
                    })
                }
            };
            this.element.addEventListener('transitionend', handleGapEnd);

        } else {
            this.element.classList.remove(styles['categories--content-open']);

            const handleContentEnd = (e: TransitionEvent) => {
                if (e.propertyName === 'grid-template-rows') {
                    this.element?.removeEventListener('transitionend', handleContentEnd);

                    this.element?.classList.remove(styles['categories--gap-open']);
                    this.element?.addEventListener('transitionend', () => extendedWrapper.style.display = 'none', { once: true });
                }
            };
            this.element.addEventListener('transitionend', handleContentEnd);
        }
    }

    protected override initListeners(): void {
        super.initListeners();

        const toggle = this.fields['category-toggle'];
        toggle.addEventListener('click', this.handleToggleClick);
    }

    protected override _render(): HTMLElement {
        const element = stringToElement(template({ styles }));
        this.renderCategories(element);
        return element;
    }
}
