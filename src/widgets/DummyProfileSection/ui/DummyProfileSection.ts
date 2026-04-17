import './style.scss';

import { stringToElement } from '@/shared/utils';

import template from './DummyProfileSection.hbs?compiled';

export class DummyProfileSection {
    private element?: HTMLElement;

    constructor() { }

    public render(): HTMLElement {
        this.element = stringToElement(template());
        return this.element;
    }
}
