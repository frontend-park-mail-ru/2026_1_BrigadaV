import './style.scss';

import { stringToElement } from '@/shared/utils';

import { AboutMeProps } from '../model/types';
import template from './AboutMe.hbs?compiled';

export class AboutMe {
    private element?: HTMLElement;

    constructor(private props: AboutMeProps) {}

    public render(): HTMLElement {
        this.element = stringToElement(template(this.props));
        return this.element;
    }
}
