import './style.scss';

import { ReviewListProps } from '../model/types';
import { AbstractList } from '@/shared/ui/AbstractList';
import { ReviewCard } from '@/entities/Review';

export class ReviewList extends AbstractList<ReviewCard, ReviewListProps> {
    constructor(props: ReviewListProps) {
        super(props);
        this.element.classList.add('review-list');
    }

    protected async loadData(): Promise<ReviewCard[]> {
        return [
            new ReviewCard({
                review: {
                    id: 1,
                    author: 'Антон Смирнов',
                    title: 'Title1',
                    content: 'Один из крупнейших музеев в мире! Очень интересные экспозиции.  Много древних сокровищ.',
                    rating: 5.0,
                    createdAt: new Date(2026, 2, 1),
                }
            }),
            new ReviewCard({
                review: {
                    id: 2,
                    author: 'Katie',
                    title: 'Title2',
                    content: 'Я бы не поехала, если бы не греческий гид, который неоднократно жаловался на то, что мраморные скульптуры Элгина находятся в Британском музее',
                    rating: 4.0,
                    createdAt: new Date(2026, 3, 1),
                }
            }),
            new ReviewCard({
                review: {
                    id: 3,
                    author: 'Джон Сноу',
                    title: 'Title3',
                    content: 'Британский музей - поистине незабываемый опыт. Коллекция обширна и прекрасно курируется, на ней представлены сокровища со всех уголков мира.',
                    rating: 3.0,
                    createdAt: new Date(2023, 11, 1),
                }
            }),
        ];
    }

    protected renderItem(item: ReviewCard): HTMLElement {
        const li = document.createElement('li');
        li.classList.add('review-list__item');
        li.appendChild(item.render());

        return li;
    }
}
