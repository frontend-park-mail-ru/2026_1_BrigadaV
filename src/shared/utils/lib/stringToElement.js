export const stringToElement = (htmlString) => {
    const parser = document.createElement('div');
    parser.innerHTML = htmlString;
    return parser.firstElementChild;
};
