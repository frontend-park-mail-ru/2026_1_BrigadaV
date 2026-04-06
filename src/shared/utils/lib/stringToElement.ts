export const stringToElement = <T extends HTMLElement = HTMLElement>(htmlString: string): T => {
    const parser = document.createElement('div');
    parser.innerHTML = htmlString;

    const element = parser.firstElementChild;

    if (!(element instanceof HTMLElement)) {
        throw new Error(`Failed to parse "${htmlString.slice(0, 30)}..."`);
    }

    return element as T;
};
