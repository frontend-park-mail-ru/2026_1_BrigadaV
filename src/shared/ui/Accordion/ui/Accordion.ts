import { BaseComponent } from '@/shared/lib/component/BaseComponent';
import { stringToElement } from '@/shared/utils';

import { AccordionProps } from '../model/types';
import template from './Accordion.hbs?compiled';
import styles from './style.module.scss';

export abstract class Accordion<TItem, TProps extends AccordionProps<TItem> = AccordionProps<TItem>> extends BaseComponent {
    protected abstract baseCount: number;
    constructor(protected props: TProps) { super(); }

    protected abstract createItem(item: TItem): HTMLElement;

    private renderItems() {
        const baseContainer = this.fields['accordion-base'];
        const extendedContainer = this.fields['accordion-extended'];

        if (!baseContainer || !extendedContainer) return;

        const baseItems = this.props.items.slice(0, this.baseCount);
        const extendedItems = this.props.items.slice(this.baseCount);

        baseItems.forEach(item => baseContainer.appendChild(this.createItem(item)));
        extendedItems.forEach(item => extendedContainer.appendChild(this.createItem(item)));
    }

    private handleToggleClick = () => {
        if (!this.element) return;

        const extendedWrapper = this.fields['extended-wrapper'];
        const isOpened = this.element.classList.contains(styles['accordion--gap-open']);

        if (!isOpened) {
            this.element.classList.add(styles['accordion--gap-open']);

            const handleGapEnd = (e: TransitionEvent) => {
                if (e.propertyName === 'gap' || e.propertyName === 'column-gap') {
                    this.element?.removeEventListener('transitionend', handleGapEnd);
                    extendedWrapper.style.display = 'grid';
                    setTimeout(() => this.element?.classList.add(styles['accordion--content-open']), 0);
                }
            };
            this.element.addEventListener('transitionend', handleGapEnd);
        } else {
            this.element.classList.remove(styles['accordion--content-open']);
            const handleContentEnd = (e: TransitionEvent) => {
                if (e.propertyName === 'grid-template-rows') {
                    this.element?.removeEventListener('transitionend', handleContentEnd);
                    this.element?.classList.remove(styles['accordion--gap-open']);
                    this.element?.addEventListener('transitionend', () => {
                        extendedWrapper.style.display = 'none';
                    }, { once: true });
                }
            };
            this.element.addEventListener('transitionend', handleContentEnd);
        }
    };

    protected override initListeners(): void {
        super.initListeners();
        this.fields['accordion-toggle']?.addEventListener('click', this.handleToggleClick);
    }

    protected override _render(): HTMLElement {
        return stringToElement(template({
            styles,
            title: this.props.title
        }));
    }

    public override render(): HTMLElement {
        super.render();
        this.renderItems();
        return this.element!;
    }
}
