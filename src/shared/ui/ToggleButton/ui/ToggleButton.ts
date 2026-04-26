import './style.scss';

import { BaseComponent } from '@/shared/lib/component/BaseComponent';
import { stringToElement } from '@/shared/utils';

import { ToggleButtonProps } from '../model/types';
import template from './ToggleButton.hbs?compiled';

export class ToggleButton<T> extends BaseComponent {
    constructor(private props: ToggleButtonProps<T>) { super(); }

    protected override initListeners(): void {
        super.initListeners();
        this.element?.addEventListener('click', this.handleClick);
    }

    private handleClick = (): void => {
        const nextState = !this.props.isActive;
        this.props.onToggle(nextState, this.props.payload);

        this.element?.classList.toggle('toggle--active');
        this.props.isActive = nextState;
    };

    protected override _render(): HTMLElement {
        return stringToElement(template(this.props));
    }
}
