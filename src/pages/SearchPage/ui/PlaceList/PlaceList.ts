import { Place, PlaceCard } from "@/entities/Place";
import { stringToElement } from "@/shared/utils";
import { BaseComponent } from "@/shared/lib/component/BaseComponent";
import { PlaceListProps } from "./types";
import { LikeButton } from "@/shared/ui";

export class PlaceList extends BaseComponent {
    constructor(private props: PlaceListProps) { super() }

    public setItems(places: Place[]): void {
        if (!this.element) return;

        this.element.innerHTML = '';

        places.forEach(place => {
            const searchItemCard = new PlaceCard({
                place,
                ...(this.props.authorized && {
                    action: new LikeButton({ isLiked: place.isLiked })
                })
            });

            const li = document.createElement('li');
            li.appendChild(searchItemCard.render());
            li.classList.add('place-list__item');

            this.element?.appendChild(li);
        });
    }

    protected override _render(): HTMLElement {
        this.element = document.createElement('ul');

        if (this.props.defaultPlaces) this.setItems(this.props.defaultPlaces);

        return this.element;
    }
}
