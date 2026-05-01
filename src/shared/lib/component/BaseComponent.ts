import { IComponent } from '@/shared/model';
import { injectComponents } from '@/shared/utils';

import { Callback, eventBus } from '../eventBus/eventBus';

export abstract class BaseComponent<TElement extends HTMLElement = HTMLElement> implements IComponent {
    protected element?: TElement;
    protected children: Record<string, IComponent> = {};
    protected fields: Record<string, HTMLElement> = {};

    protected abstract _render(): TElement;
    protected _finalize(): void { };
    protected _destroy(): void { };

    protected get eventHandlers(): Record<string, Callback> {
        return {};
    }

    protected initListeners() {
        Object.entries(this.eventHandlers).forEach(([eventName, handler]) => eventBus.on(eventName, handler));
    }

    protected initFields(element: HTMLElement) {
        const refs = element.querySelectorAll<HTMLElement>('[data-ref]');
        refs.forEach((item) => {
            const key = item.dataset.ref!;
            this.fields[key] = item;
        });
    }


    public render(): TElement {
        this.element = this._render();

        this.initFields(this.element);
        injectComponents(this.element, this.children);
        this.initListeners();

        return this.element;
    }


    public finalize(): void {
        this._finalize();
        Object.values(this.children).forEach(child => child.finalize());
    }

    public destroy(): void {
        this._destroy();
        Object.entries(this.eventHandlers).forEach(([eventName, handler]) => eventBus.off(eventName, handler));
        Object.values(this.children).forEach(child => child.destroy());

        this.children = {};
        this.fields = {};

        this.element?.remove();
        this.element = undefined;
    }
}
