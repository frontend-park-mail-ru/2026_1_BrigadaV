import './style.scss';

import { LikeButton } from '@/shared/ui';
import { stringToElement } from '@/shared/utils';

import { PlaceCardProps } from '../model/types';
import template from './PlaceCard.hbs?compiled';

export class PlaceCard {
    private element: HTMLElement | null = null;
    private likeButton: LikeButton | null = null;

    constructor(private props: PlaceCardProps) {
        this.likeButton = new LikeButton({
            className: 'card__like',
            isLiked: props.isLiked,
        });
    }

    public render(): HTMLElement {
        this.element = stringToElement(template(this.props));

        if (this.props.authorized && this.likeButton) {
            this.element.querySelector('[data-slot="like-button"]')
                ?.replaceWith(this.likeButton.render());
        }

        return this.element;
    }
}
