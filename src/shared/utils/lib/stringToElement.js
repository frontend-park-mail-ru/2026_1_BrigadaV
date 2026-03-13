/**
 * Преобразует HTML-строку в DOM-элемент
 * 
 * @function stringToElement
 * @param {string} htmlString - Строка с HTML-разметкой
 * @returns {Element|null} Созданный DOM-элемент или null, если строка пуста
 * 
 * @example
 * const button = stringToElement('<button class="btn">Click me</button>');
 * document.body.appendChild(button);
 */
export const stringToElement = (htmlString) => {
    const parser = document.createElement('div');
    parser.innerHTML = htmlString;
    return parser.firstElementChild;
};
