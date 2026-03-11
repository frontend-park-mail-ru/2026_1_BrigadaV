import template from './AuthLinks.hbs?compiled';
import './style.scss';

import { stringToElement } from '@/shared/utils';

export class AuthLinks {
    constructor() {
        this.element = stringToElement(template());
    }

    render() {
        return this.element;
    }
}
