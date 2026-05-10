import { eventBus } from "@/shared/lib";
import { BaseComponent } from "@/shared/lib/component/BaseComponent";
import { CategorySidebarProps } from "../model/types";
import { stringToElement } from "@/shared/utils";
import styles from './style.module.scss';
import template from './CategorySidebar.hbs?compiled';


export class CategorySidebar extends BaseComponent {
    private activeCategoryIds: number[] = [];
    private startX = 0;

    constructor(private props: CategorySidebarProps) { super(); }

    public setSelectedIds = (ids: number[]): void => {
        this.activeCategoryIds = ids;
        const checkboxes = this.element?.querySelectorAll<HTMLInputElement>('input[type="checkbox"]');

        checkboxes?.forEach(checkbox => {
            const id = Number(checkbox.dataset.id);
            checkbox.checked = ids.includes(id);
        });
    }

    private renderCategories() {
        this.props.categories.forEach(category =>
            this.fields['category-list'].appendChild(this.createItem(category)));
    }

    private createItem = (category: { id: number; name: string }) => {
        const li = document.createElement('li');
        li.className = styles['sidebar__item'];

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.className = styles['sidebar__input'];
        checkbox.dataset.id = category.id.toString();

        checkbox.addEventListener('change', this.handleCheckboxToggle);

        li.appendChild(checkbox);
        li.append(category.name);
        return li;
    };


    private handleCheckboxToggle = (event: Event) => {
        const target = event.target;
        if (!(target instanceof HTMLInputElement)) return;

        const id = Number(target.dataset.id);

        if (target.checked) {
            this.activeCategoryIds.push(id);
        } else {
            this.activeCategoryIds = this.activeCategoryIds.filter(activeId => activeId !== id);
        }

        eventBus.emit('CategorySidebar:toggle-category', {
            ids: this.activeCategoryIds
        });
    }

    public toggle(force?: boolean) {
        this.element?.classList.toggle(styles['sidebar--open'], force);
    }

    public open() { this.toggle(true) }
    public close() { this.toggle(false) }

    protected override initListeners(): void {
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

    protected override _render(): HTMLElement {
        return stringToElement(template({ styles }));
    }

    public override render(): HTMLElement {
        super.render();
        this.renderCategories();
        if (this.props.activeIds) {
            this.setSelectedIds(this.props.activeIds);
        }

        return this.element!;
    }
}
