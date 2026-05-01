import { BaseComponent } from '@/shared/lib/component/BaseComponent';
import { PlaceDropDownListProps, PlaceDropDownStates } from './model/types';
import { stringToElement } from '@/shared/utils';
import './style.scss';

import template from './PlaceDropDownList.hbs?compiled';
import { PlaceSearchItem } from '@/entities/Place/ui/PlaceSearchItem';
import { SearchResult } from '../model/types';

export class PlaceDropDownList extends BaseComponent {
    private static readonly STATE_HEADERS: Record<string, (props: PlaceDropDownListProps) => string> = {
        'prompt': () => 'Вот что удалось найти',
        'empty': (props) => props.emptyPromptHeader || '',
        'no-results': () => 'По вашему запросу ничего не найдено',
    };

    private lastState: PlaceDropDownStates = 'hidden';

    constructor(private props: PlaceDropDownListProps) { super(); }

    public setItems(results: SearchResult[]): void {
        this.fields['item-list'].innerHTML = '';

        results.forEach(result => {
            const searchItemCard = new PlaceSearchItem(result);

            const li = document.createElement('li');
            li.appendChild(searchItemCard.render());
            li.classList.add('drop-down__item');

            this.fields['item-list'].appendChild(li);
        });
    }

    public resume(): void {
        this.setState(this.lastState);
    }

    public clear(): void {
        this.fields['item-list'].innerHTML = '';
    }

    public setState(state: 'hidden' | 'empty' | 'prompt' | 'no-results'): void {
        if (!this.element) return;

        if (state !== 'hidden') {
            this.lastState = state;
        }

        this.element.setAttribute('data-state', state);

        const getHeader = PlaceDropDownList.STATE_HEADERS[state];

        if (getHeader) {
            this.fields['header'].textContent = getHeader(this.props);
        }
    }

    protected override _render(): HTMLElement {
        return stringToElement(template(this.props));
    }
}
