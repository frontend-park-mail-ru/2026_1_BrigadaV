
import { BaseComponent } from '@/shared/lib/component/BaseComponent';
import { IComponent } from '@/shared/model';

export abstract class BaseList<TEntity, TProps extends { className?: string; tag?: 'ul' | 'ol' }> extends BaseComponent<HTMLUListElement | HTMLOListElement> {
    protected abstract listClassName: string;
    protected abstract itemClassName: string;

    constructor(protected props: TProps) { super(); }

    protected abstract loadData(): Promise<TEntity[]>;
    protected abstract getItemId(item: TEntity): number;
    protected abstract createItemComponent(item: TEntity): IComponent;

    // TODO add pagination

    private processItem(item: TEntity): HTMLElement {
        const id = this.getItemId(item);
        const component = this.createItemComponent(item);

        this.children[id] = component;

        const li = document.createElement('li');
        li.className = this.itemClassName;
        li.setAttribute('data-id', String(id));
        li.appendChild(component.render());

        return li;
    }

    public addItem(item: TEntity, position: InsertPosition = 'beforeend'): void {
        const element = this.processItem(item);
        this.element?.insertAdjacentElement(position, element);
    }

    public updateItem(newItem: TEntity): void {
        const id = this.getItemId(newItem);
        const oldComponent = this.children[id];

        const oldElement = this.element?.querySelector(`[data-id="${id}"]`);
        const newElement = this.processItem(newItem);

        if (oldElement) {
            oldElement.replaceWith(newElement);
        } else {
            this.element?.appendChild(newElement);
        }

        oldComponent?.destroy();
    }

    public removeItem(id: number): void {
        const component = this.children[id];

        if (component) {
            component.destroy();
            delete this.children[id];
        }

        const element = this.element?.querySelector(`[data-id="${id}"]`);
        element?.remove();
    }

    private async init(): Promise<void> {
        try {
            const data = await this.loadData();

            // TODO add empty state

            data.forEach(item => {
                const element = this.processItem(item);
                this.element?.appendChild(element);
            });
        } catch (error) {
            // TODO add error state
        }
    }

    protected override _render(): HTMLUListElement | HTMLOListElement {
        const tag = this.props.tag || 'ul';
        this.element = document.createElement(tag);

        if (this.props.className) this.element.className = this.props.className;
        this.element.classList.add(this.listClassName);

        // TODO add loading animation
        this.init();
        return this.element!;
    }
}
