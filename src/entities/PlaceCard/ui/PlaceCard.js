import template from './PlaceCard.hbs?compiled';
import './style.scss';
import { stringToElement } from '@/shared/utils';

export class PlaceCard {
    constructor(props) {
        this.props = props;
        this.element = stringToElement(template(this.props));
    }

    render() {
        return this.element;
    }
}
