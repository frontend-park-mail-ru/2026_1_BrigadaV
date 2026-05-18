import { CategoryAccordion } from '@/entities/Category';
import { RatingAccordion } from '@/entities/Review/ui/RatingAccordion';
import { BaseComponent } from '@/shared/lib/component/BaseComponent';
import { Callback, eventBus } from '@/shared/lib/eventBus/eventBus';
import { AmountFilter } from '@/shared/ui/AmountFilter';
import { stringToElement } from '@/shared/utils';
import { debounce } from '@/shared/utils/lib/debounce';

import { FiltersProps, FiltersState } from '../model/types';
import template from './Filters.hbs?compiled';
import styles from './style.module.scss';

export class Filters extends BaseComponent {
    declare children: {
        categoryFilter: CategoryAccordion;
        ratingFilter: RatingAccordion;
        reviewCountFilter: AmountFilter;
    };

    private isMobile = window.innerWidth < 1024;
    private startX = 0;

    private state: FiltersState = {
        categoryIds: [],
        ratingIds: [],
        reviewCount: 0,
    };

    constructor(props: FiltersProps) {
        super();

        this.children = {
            categoryFilter: new CategoryAccordion({
                title: 'Категории',
                items: props.categories,
            }),

            ratingFilter: new RatingAccordion({
                title: 'Оценка',
                items: [
                    { id: 1, name: 'Превосходно', threshold: 4.5 },
                    { id: 2, name: 'Очень хорошо', threshold: 4.0 },
                    { id: 3, name: 'Хорошо', threshold: 3.5 },
                    { id: 4, name: 'Достаточно хорошо', threshold: 3.0 },
                    { id: 5, name: 'Удовлетворительно', threshold: 2.5 },
                ],
            }),

            reviewCountFilter: new AmountFilter({
                title: 'Отзывы',
                onInput: debounce(this.handleReviewCountChange),
            })
        };
    }

    protected override createHandlers(): Record<string, Callback> {
        return {
            'CategoryAccordion:toggle-category': this.handleCategoryToggle,
            'RatingAccordion:toggle-rating': this.handleRatingToggle,
        };
    }

    private handleCategoryToggle = (data: { ids: number[] }) => {
        this.state.categoryIds = data.ids;
        this.emitFilterChange();
    };

    private handleRatingToggle = (data: { ids: number[] }) => {
        this.state.ratingIds = data.ids;
        this.emitFilterChange();
    };

    private handleReviewCountChange = (value: string) => {
        this.state.reviewCount = Number(value) || 0;
        this.emitFilterChange();
    };

    private emitFilterChange() {
        eventBus.emit('Filters:change', this.state);
    }

    protected override initListeners(): void {
        super.initListeners();

        window.addEventListener('resize', this.handleResize);

        this.fields['open-toggle'].addEventListener('click', () => this.toggle());

        this.element?.addEventListener('touchstart', (event) => {
            this.startX = event.touches[0].clientX;
        });

        this.element?.addEventListener('touchend', (event) => {
            const endX = event.changedTouches[0].clientX;
            if (this.startX - endX > 50) {
                this.close();
            }
        });
    }

    private handleResize = () => {
        this.isMobile = window.innerWidth < 1024;
        if (this.element) {
            this.element.dataset.view = this.isMobile ? 'mobile' : '';
        }
    };

    public toggle(force?: boolean) {
        this.element?.classList.toggle(styles['filters--open'], force);
    }

    public open() { this.toggle(true); }
    public close() { this.toggle(false); }

    protected override _render(): HTMLElement {
        const element = stringToElement(template({ styles }));
        element.dataset.view = this.isMobile ? 'mobile' : '';
        return element;
    }

    protected override _destroy(): void {
        window.removeEventListener('resize', this.handleResize);
    }
}
