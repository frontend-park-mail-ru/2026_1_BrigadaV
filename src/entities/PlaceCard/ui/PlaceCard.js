import template from './PlaceCard.hbs?compiled';
import './style.scss';

import { LikeButton } from '@/features/LikeButton';

export const PlaceCard = (props) => {
    return template({
        likeButton: LikeButton({
            className: "card__like",
            isLiked: props.isLiked
        }),
        ...props
    });
}
