export const stringToElement = (htmlString: string): HTMLElement => {
    const parser = document.createElement('div');
    parser.innerHTML = htmlString;

    const element = parser.firstElementChild;

    if (!(element instanceof HTMLElement)) {
        throw new Error(`Failed to parse "${htmlString.slice(0, 30)}..."`)
    }

    return element;
};
