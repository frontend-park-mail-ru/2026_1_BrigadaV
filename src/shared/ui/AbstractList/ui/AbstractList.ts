import { stringToElement } from '@/shared/utils';
import template from './AbstractList.hbs?compiled';

export abstract class AbstractList<T, P extends Record<string, unknown> | undefined> {
    protected element: HTMLElement;

    constructor(private props: P) {
        this.element = stringToElement(template(props));
    }

    protected abstract loadData(): Promise<T[]>;
    protected abstract renderItem(item: T): HTMLElement;

    // TODO add pagination and list update methods

    private async init(): Promise<void> {
        try {
            const data = await this.loadData();

            data.forEach(item => {
                this.element.appendChild(this.renderItem(item));
            });

        } catch {
            // TODO add error state
        }
    }

    public render(): HTMLElement {
        // TODO add loading animation
        this.init();
        return this.element;
    }
}
