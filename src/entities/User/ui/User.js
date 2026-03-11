import template from './User.hbs?compiled';
import './style.scss';

import { stringToElement } from '@/shared/utils';

export class User {
    constructor(props) {
        this.element = stringToElement(template(props));
    }

    render() {
        return this.element;
    }
}
