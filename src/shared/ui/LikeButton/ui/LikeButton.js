import template from './LikeButton.hbs?compiled';
import './style.scss';
import { stringToElement } from '@/shared/utils';

export class LikeButton {
    constructor(props) {
        this.props = props;
    }

    initListeners() {
        this.element.addEventListener('click', () => {
            this.element.classList.toggle('like--active');
        });
    }

    render() {
        this.element = stringToElement(template(this.props));
        this.initListeners();
        return this.element;
    }
}
