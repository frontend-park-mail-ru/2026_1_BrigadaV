import { BaseComponent } from "@/shared/lib/component/BaseComponent";
import { PlaceDropDownListProps } from "./model/types";
import { stringToElement } from "@/shared/utils";
import './style.scss';

import template from './PlaceDropDownList.hbs?compiled';
import { Place } from "@/entities/Place/model/types";
import { PlaceSearchItem } from "@/entities/Place/ui/PlaceSearchItem";

export class PlaceDropDownList extends BaseComponent {
    constructor(private props: PlaceDropDownListProps) { super() }

    public setItems(places: Pick<Place, 'id' | 'name' | 'country' | 'image'>[]): void {
        this.fields['item-list'].innerHTML = '';

        places.forEach(place => {
            const searchItemCard = new PlaceSearchItem({ place });

            const li = document.createElement('li');
            li.appendChild(searchItemCard.render());
            li.classList.add('drop-down__item');

            this.fields['item-list'].appendChild(li);
        })
    }

    public setState(state: 'hidden' | 'empty' | 'prompt'): void {
        switch (state) {
            case 'hidden':
                this.element?.classList.toggle('drop-down--hidden', true);
                break;

            case 'empty':
                this.element?.classList.toggle('drop-down--hidden', false);
                this.element?.classList.toggle('drop-down--empty', true);
                break;

            case 'prompt':
                this.element?.classList.toggle('drop-down--hidden', false);
                this.element?.classList.toggle('drop-down--empty', false);
                break;
        }
    }

    protected override _render(): HTMLElement {
        return stringToElement(template(this.props));
    }
}
