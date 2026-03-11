import template from './LikeButton.hbs?compiled';
import './style.scss';
import { stringToElement } from '@/shared/utils';

export class LikeButton {
    constructor(props) {
        this.props = props;
        this.element = stringToElement(template(this.props));
        this.initListeners();
    }

    initListeners() {
        this.element.addEventListener('click', (event) => {
            this.element.classList.toggle('like--active');
        });
    }

    render() {
        return this.element;
    }
}
