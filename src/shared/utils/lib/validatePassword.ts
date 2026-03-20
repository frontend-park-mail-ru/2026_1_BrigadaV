export const validatePassword = (password: string): boolean => {
    if (password.length < 8 || password.length > 50) {
        return false;
    }

    const isLong = password.length >= 16;
    const hasLower = /[a-z]/.test(password);
    const hasUpper = /[A-Z]/.test(password);
    const hasDigits = /[0-9]/.test(password);
    const hasSpecial = /[^a-zA-Z0-9]/.test(password);

    const countTraits = [isLong, hasLower, hasUpper, hasDigits, hasSpecial].reduce((acc, value) => acc + Number(value), 0);
    // TODO Добавить полоску с уровнями "слабый", "средний", "сильный" пароль
    return countTraits > 1;
}
