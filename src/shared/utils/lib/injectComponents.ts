import { IComponent } from '@/shared/model';

export const injectComponents = (parent: HTMLElement, slots: Record<string, IComponent | undefined>) => {
    Object.entries(slots).forEach(([name, component]) => {
        const slot = parent.querySelector(`[data-slot="${name}"]`);
        if (slot && component) {
            const renderedElement = component.render();

            if (slot.classList.length > 0) {
                renderedElement.classList.add(...Array.from(slot.classList))
            }

            slot.replaceWith(renderedElement);
        }
    });
};
