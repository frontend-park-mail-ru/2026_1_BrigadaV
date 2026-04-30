import './style.scss';
import { BaseComponent } from '@/shared/lib/component/BaseComponent';
import { stringToElement } from '@/shared/utils';
import { AccordionProps } from '../model/types';
import template from './Accordion.hbs?compiled';

export class Accordion extends BaseComponent {
    private isOpen: boolean;

    constructor(private props: AccordionProps) {
        super();
        this.isOpen = !!props.isOpen;
    }

    protected override initListeners(): void {
        super.initListeners();

        const toggleHandle = this.fields['toggle'];
        if (toggleHandle) {
            toggleHandle.addEventListener('click', () => this.toggle());
        }
    }

    public toggle(): void {
        this.setOpen(!this.isOpen);
    }

    public setOpen(state: boolean): void {
        this.isOpen = state;

        if (this.element) {
            this.element.classList.toggle('accordion--open', this.isOpen);
        }

        this.props.onToggle?.(this.isOpen);
    }

    protected override _render(): HTMLElement {
        return stringToElement(template({ ...this.props, isOpen: this.isOpen }));
    }
}
