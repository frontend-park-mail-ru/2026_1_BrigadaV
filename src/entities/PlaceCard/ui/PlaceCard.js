import template from './PlaceCard.hbs?compiled';
import './style.scss';

import { stringToElement } from '@/shared/utils';
import { LikeButton } from '@/shared/ui/LikeButton/ui/LikeButton';

export class PlaceCard {
    constructor(props) {
        this.props = props;

        this.likeButton = new LikeButton({
            className: 'card__like',
            isLiked: props.isLiked,
        });
    }

    render() {
        this.element = stringToElement(template(this.props));

        if (this.props.authorized) {
            this.element.querySelector('[data-slot="like-button"]')
                .replaceWith(this.likeButton.render());
        }

        return this.element;
    }
}
