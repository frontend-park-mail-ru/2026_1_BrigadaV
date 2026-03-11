import template from './AuthPrompt.hbs?compiled';
import './style.scss';

import { stringToElement } from '@/shared/utils';

export class AuthPrompt {
    constructor(props) {
        this.element = stringToElement(template(props));
    }

    render() {
        return this.element;
    }
}
