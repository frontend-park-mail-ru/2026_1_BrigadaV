import { BaseComponent } from '@/shared/lib/component/BaseComponent';
import { PlaceDropDownListProps, PlaceDropDownStates } from './model/types';
import { stringToElement } from '@/shared/utils';
import './style.scss';

import template from './PlaceDropDownList.hbs?compiled';
import { PlaceSearchItem } from '@/entities/Place/ui/PlaceSearchItem';
import { SearchResult } from '../model/types';

export class PlaceDropDownList extends BaseComponent {
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

        if (state === 'no-results') {
            this.fields['header'].textContent = 'По вашему запросу ничего не найдено';
        } else if (state === 'empty') {
            this.fields['header'].textContent = this.props.emptyPromptHeader || '';
        }
    }

    protected override _render(): HTMLElement {
        return stringToElement(template(this.props));
    }
}
