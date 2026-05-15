import { eventBus } from '@/shared/lib/eventBus/eventBus';
import { Accordion } from '@/shared/ui/Accordion';
import styles from './style.module.scss';
import { RatingAccordionProps, SingleRatingItem } from '../model/types';

export class RatingAccordion extends Accordion<SingleRatingItem, RatingAccordionProps> {
    protected override baseCount: number = 3;
    private activeRatingIds: number[] = [];

    constructor(props: RatingAccordionProps) { super(props); }

    protected override createItem(rating: SingleRatingItem): HTMLElement {
        const li = document.createElement('li');
        li.className = styles['ratings__item'];

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.className = styles['ratings__input'];
        checkbox.dataset.id = rating.id.toString();
        checkbox.checked = this.activeRatingIds.includes(rating.id);

        checkbox.addEventListener('change', this.handleCheckboxToggle);

        li.appendChild(checkbox);
        li.append(this.makeRatingName(rating));
        return li;
    }

    private makeRatingName({name, threshold}: SingleRatingItem) {
        return `${name}: ${threshold}+`;
    }

    private handleCheckboxToggle = (event: Event) => {
        const target = event.target as HTMLInputElement;
        const id = Number(target.dataset.id);

        if (target.checked) {
            this.activeRatingIds.push(id);
        } else {
            this.activeRatingIds = this.activeRatingIds.filter(activeId => activeId !== id);
        }

        eventBus.emit('RatingAccordion:toggle-rating', {
            ids: this.activeRatingIds
        });
    }

    public setSelectedIds(ids: number[]): void {
        this.activeRatingIds = ids;
        const checkboxes = this.element?.querySelectorAll<HTMLInputElement>('input[type="checkbox"]');
        checkboxes?.forEach(checkbox => {
            checkbox.checked = ids.includes(Number(checkbox.dataset.id));
        });
    }

    public override render(): HTMLElement {
        if (this.props.activeIds) {
            this.activeRatingIds = this.props.activeIds;
        }

        return super.render();
    }
}
