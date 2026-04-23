import './style.scss';

import { BaseComponent } from '@/shared/lib/component/BaseComponent';
import { stringToElement } from '@/shared/utils';

import template from './DummyProfileSection.hbs?compiled';

export class DummyProfileSection extends BaseComponent {
    constructor() { super(); }

    protected override _render(): HTMLElement {
        return stringToElement(template());
    }
}
