import { IComponent } from '@/shared/model';

export const injectComponents = (parent: HTMLElement, slots: Record<string, IComponent | undefined>) => {
    Object.entries(slots).forEach(([name, component]) => {
        const kebabName = camelToKebab(name);
        const slot = parent.querySelector(`[data-slot="${kebabName}"]`);

        if (slot && component) {
            const renderedElement = component.render();

            if (slot.classList.length > 0) {
                renderedElement.classList.add(...Array.from(slot.classList));
            }

            slot.replaceWith(renderedElement);
        }
    });
};

const camelToKebab = (str: string): string => {
    return str.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
};
