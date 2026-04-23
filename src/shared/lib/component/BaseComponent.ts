import { IComponent } from '@/shared/model';
import { injectComponents } from '@/shared/utils';

import { Callback, eventBus } from '../eventBus/eventBus';

export abstract class BaseComponent<TElement extends HTMLElement = HTMLElement> implements IComponent {
    protected element?: TElement;
    protected children: Record<string, IComponent> = {};

    protected abstract _render(): TElement;
    protected _destroy(): void { };

    protected get eventHandlers(): Record<string, Callback> {
        return {};
    }

    protected initListeners() {
        Object.entries(this.eventHandlers).forEach(([eventName, handler]) => eventBus.on(eventName, handler));
    }

    public render(): TElement {
        this.element = this._render();

        injectComponents(this.element, this.children);
        this.initListeners();
        return this.element;
    }

    public destroy(): void {
        this._destroy();
        Object.entries(this.eventHandlers).forEach(([eventName, handler]) => eventBus.off(eventName, handler));
        Object.values(this.children).forEach(child => child.destroy());

        this.children = {};

        this.element?.remove();
        this.element = undefined;
    }
}
