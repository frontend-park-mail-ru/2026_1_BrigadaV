/**
 * Проверяет корректность формата email-адреса
 *
 * @function validateEmail
 * @param {string} email - Email-адрес для проверки
 * @returns {boolean} true, если email имеет корректный формат, иначе false
 *
 * @example
 * // Валидные email'ы
 * validateEmail('user@example.com');     // true
 * validateEmail('user.name@domain.co');  // true
 * validateEmail('user+tag@domain.com');  // true
 *
 * @example
 * // Невалидные email'ы
 * validateEmail('invalid');              // false (нет @)
 * validateEmail('user@domain');          // false (нет точки)
 * validateEmail('@domain.com');          // false (нет локальной части)
 * validateEmail('user@.com');            // false (пустой домен)
 * validateEmail('user@domain.');         // false (пустой TLD)
 */
export const validateEmail = (email) => {
    const emailRegex = /[a-zA-Z0-9]+(?:[.+-][a-zA-Z0-9]+)*@[a-zA-Z0-9]+(?:[.-][a-zA-Z0-9]+)*\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
};
