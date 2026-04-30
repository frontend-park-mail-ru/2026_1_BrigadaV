import { Place, PlaceCard } from "@/entities/Place";
import { stringToElement } from "@/shared/utils";
import { BaseComponent } from "@/shared/lib/component/BaseComponent";

export class PlaceList extends BaseComponent {
    constructor() { super() }

    public setItems(results: Place[]): void {
        if (!this.element) return;

        this.element.innerHTML = '';

        results.forEach(result => {
            const searchItemCard = new PlaceCard({ place: result });

            const li = document.createElement('li');
            li.appendChild(searchItemCard.render());
            li.classList.add('drop-down__item');

            this.element?.appendChild(li);
        });
    }

    protected override _render(): HTMLElement {
        return document.createElement('ul');
    }
}
